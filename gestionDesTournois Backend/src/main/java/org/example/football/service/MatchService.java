package org.example.football.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.football.Enum.*;
import org.example.football.dto.match.MatchResponseDTO;
import org.example.football.dto.match.PlanifierMatchDTO;
import org.example.football.entites.*;
import org.example.football.mapper.MatchMapper;
import org.example.football.repository.MatchRepository;
import org.example.football.repository.StadeRepository;
import org.example.football.repository.TournoiRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

    private final TournoiRepository tournoiRepository;
    private final MatchRepository matchRepository;
    private final MatchMapper matchMapper;
    private final StadeRepository stadeRepository;



    public List<LocalTime> getAvailableSlots(Long stadeId, LocalDate date) {

        List<Match> matches = matchRepository.findByStadeIdAndDateMatch(stadeId, date);

        Set<LocalTime> busy = matches.stream()
                .map(Match::getHeureDebut)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Stade stade = stadeRepository.findById(stadeId)
                .orElseThrow(() -> new RuntimeException("Stade inconnu"));

        SlotGenerator generator = new SlotGenerator();

        List<LocalTime> allSlots = generator.generateSlots(
                stade.getHeureOuverture(),
                stade.getHeureFermeture()
        );

        return allSlots.stream()
                .filter(s -> !busy.contains(s))
                .toList();
    }


    @Transactional
    public void planifierMatch(PlanifierMatchDTO dto) {

        Stade stade = stadeRepository.findById(dto.getStadeId())
                .orElseThrow(() -> new RuntimeException("Stade inconnu"));

        Match match = matchRepository.findById(dto.getIdMatch())
                .orElseThrow(() -> new RuntimeException("Match inconnu"));

        boolean slotPris = matchRepository.existsByStadeIdAndDateMatchAndHeureDebut(
                dto.getStadeId(),
                dto.getDateMatch(),
                dto.getHeureDebut()
        );

        if (slotPris) {
            throw new RuntimeException(
                    "Ce créneau est déjà pris pour ce stade — choisissez un autre horaire"
            );
        }

        match.setStade(stade);
        match.setDateMatch(dto.getDateMatch());
        match.setHeureDebut(dto.getHeureDebut());

        matchRepository.save(match);
    }


    public MatchResponseDTO getMatchById(long id) {
        return matchMapper.toDTO(
                matchRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Match not found"))
        );
    }

    public List<MatchResponseDTO> getAll() {
        return matchRepository.findAll()
                .stream()
                .map(matchMapper::toDTO)
                .toList();
    }

    public List<MatchResponseDTO> getMatchesByTournoi(long id) {

        return matchRepository.findByTournoi_Id(id)
                .stream()
                .map(matchMapper::toDTO)
                .toList();
    }

    public List<MatchResponseDTO> getMatchByEquipeIdAndTournoiId(long equipeId, long tournoiId) {

        return matchRepository
                .findByTournoiIdAndMatchEquipesEquipeId(tournoiId, equipeId)
                .stream()
                .map(matchMapper::toDTO)
                .toList();
    }



    @Transactional
    public void processTournament(Long tournoiId) {

        Tournoi tournoi = loadTournoi(tournoiId);

        log.info("[processTournament] tournoiId={} type={} statut={}",
                tournoiId, tournoi.getTypeTournoi(), tournoi.getStatut());

        if (tournoi.getStatut() == StatutTournois.TERMINE) {
            throw new IllegalStateException("Le tournoi est déjà terminé");
        }

        switch (tournoi.getTypeTournoi()) {
            case ROUND_ROBIN -> handleRoundRobin(tournoi);
            case ELIMINATION  -> handleElimination(tournoi);
            default           -> throw new IllegalArgumentException(
                    "Type de tournoi non supporté : " + tournoi.getTypeTournoi()
            );
        }

        tournoiRepository.save(tournoi);
    }

    private void handleRoundRobin(Tournoi tournoi) {

        if (tournoi.isEstLance()) {
            throw new IllegalStateException("Le tournoi Round-Robin est déjà lancé");
        }

        List<Equipe> equipes = extractEquipes(tournoi);
        requireMinTeams(equipes, 2);

        List<Match> matches = buildRoundRobinMatches(tournoi, equipes);
        matchRepository.saveAll(matches);

        markAsStarted(tournoi);


    }


    private void handleElimination(Tournoi tournoi) {

        List<Match> allMatches = matchRepository.findByTournoi_Id(tournoi.getId());

        if (allMatches.isEmpty()) {

            List<Equipe> equipes = extractEquipes(tournoi);
            requireMinTeams(equipes, 2);
            requirePowerOfTwo(equipes.size());

            List<Match> round1 = buildRoundMatches(tournoi, shuffled(equipes), 1);
            matchRepository.saveAll(round1);

            markAsStarted(tournoi);

            log.info("[ELIMINATION] Round 1 généré — {} matchs pour le tournoi {}",
                    round1.size(), tournoi.getId());
            return;
        }


        int currentRound        = resolveCurrentRound(allMatches);
        List<Match> roundMatches = filterByRound(allMatches, currentRound);

        if (!isRoundFinished(roundMatches)) {
            throw new IllegalStateException(
                    "Le round " + currentRound + " n'est pas encore terminé"
            );
        }


        List<Equipe> winners = resolveWinners(roundMatches);

        if (winners.size() == 1) {
            closeTournament(tournoi, winners.get(0));
            return;
        }

        requireEvenCount(winners);

        List<Match> nextRound = buildRoundMatches(tournoi, winners, currentRound + 1);
        matchRepository.saveAll(nextRound);

        log.info("[ELIMINATION] Round {} généré — {} matchs pour le tournoi {}",
                currentRound + 1, nextRound.size(), tournoi.getId());
    }


    private List<Match> buildRoundRobinMatches(Tournoi tournoi, List<Equipe> equipes) {

        List<Match> matches = new ArrayList<>();
        List<Equipe> ring   = new ArrayList<>(equipes);

        if (ring.size() % 2 != 0) ring.add(null); // bye

        int n      = ring.size();
        int rounds = n - 1;

        for (int r = 0; r < rounds; r++) {

            for (int i = 0; i < n / 2; i++) {

                Equipe home = ring.get(i);
                Equipe away = ring.get(n - 1 - i);

                if (home == null || away == null) continue;

                matches.add(buildMatch(tournoi, home, away, r + 1));
            }

            rotateRing(ring);
        }

        return matches;
    }

    private List<Match> buildRoundMatches(Tournoi tournoi, List<Equipe> teams, int round) {

        List<Match> matches = new ArrayList<>();

        for (int i = 0; i < teams.size(); i += 2) {
            matches.add(buildMatch(tournoi, teams.get(i), teams.get(i + 1), round));
        }

        return matches;
    }

    private Match buildMatch(Tournoi tournoi, Equipe home, Equipe away, int round) {

        Match match = new Match();
        match.setTournoi(tournoi);
        match.setJournee(round);
        match.setStatut(StatutMatch.PLANIFIE);

        MatchEquipe m1 = new MatchEquipe();
        m1.setMatch(match);
        m1.setEquipe(home);
        m1.setRole(RoleEquipe.DOMICILE);
        m1.setScore(0);

        MatchEquipe m2 = new MatchEquipe();
        m2.setMatch(match);
        m2.setEquipe(away);
        m2.setRole(RoleEquipe.EXTERIEUR);
        m2.setScore(0);

        match.setMatchEquipes(new ArrayList<>(List.of(m1, m2)));

        return match;
    }



    private int resolveCurrentRound(List<Match> matches) {
        return matches.stream()
                .mapToInt(Match::getJournee)
                .max()
                .orElseThrow(() -> new IllegalStateException("Aucun round trouvé"));
    }

    private List<Match> filterByRound(List<Match> matches, int round) {
        return matches.stream()
                .filter(m -> m.getJournee() == round)
                .toList();
    }

    private boolean isRoundFinished(List<Match> roundMatches) {
        return roundMatches.stream()
                .allMatch(m -> m.getStatut() == StatutMatch.TERMINE);
    }

    private List<Equipe> resolveWinners(List<Match> roundMatches) {
        return roundMatches.stream()
                .map(this::resolveWinner)
                .collect(Collectors.toList());
    }

    private Equipe resolveWinner(Match match) {

        MatchEquipe m1 = match.getMatchEquipes().get(0);
        MatchEquipe m2 = match.getMatchEquipes().get(1);

        if (m1.getScore() > m2.getScore()) return m1.getEquipe();
        if (m2.getScore() > m1.getScore()) return m2.getEquipe();

        throw new IllegalStateException(
                "Match nul interdit en élimination (matchId=" + match.getId() + ")"
        );
    }

    private void closeTournament(Tournoi tournoi, Equipe champion) {
        tournoi.setStatut(StatutTournois.TERMINE);
        log.info("[ELIMINATION] Tournoi {} TERMINÉ — Champion : {}",
                tournoi.getId(), champion.getNom());
    }



    private void markAsStarted(Tournoi tournoi) {
        tournoi.setEstLance(true);
        tournoi.setStatut(StatutTournois.EN_COURS);
    }



    private void requireMinTeams(List<Equipe> equipes, int min) {
        if (equipes.size() < min) {
            throw new IllegalArgumentException("Minimum " + min + " équipes requises");
        }
    }

    private void requirePowerOfTwo(int n) {
        if (n <= 1 || (n & (n - 1)) != 0) {
            throw new IllegalArgumentException(
                    "Le nombre d'équipes doit être une puissance de 2 (actuel : " + n + ")"
            );
        }
    }

    private void requireEvenCount(List<Equipe> winners) {
        if (winners.size() % 2 != 0) {
            throw new IllegalStateException(
                    "Nombre impair de gagnants (" + winners.size() + ") — état incohérent"
            );
        }
    }



    private Tournoi loadTournoi(Long id) {
        return tournoiRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tournoi introuvable : " + id));
    }

    private List<Equipe> extractEquipes(Tournoi tournoi) {
        return tournoi.getParticipations()
                .stream()
                .map(Participation::getEquipe)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<Equipe> shuffled(List<Equipe> equipes) {
        List<Equipe> copy = new ArrayList<>(equipes);
        Collections.shuffle(copy, new SecureRandom());
        return copy;
    }

    private void rotateRing(List<Equipe> ring) {
        if (ring.size() <= 2) return;
        ring.add(1, ring.remove(ring.size() - 1));
    }
}