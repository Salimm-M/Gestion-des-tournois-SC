package org.example.football.service;

import lombok.RequiredArgsConstructor;
import org.example.football.Enum.StatutMatch;
import org.example.football.Enum.TypeCarton;
import org.example.football.dto.AjouterEventDTO;
import org.example.football.dto.EventResponseDTO;
import org.example.football.entites.*;
import org.example.football.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EvenementService {

    private final CartonRepository cartonRepository;
    private final MatchRepository matchRepository;
    private final JoueurRepository joueurRepository;
    private final EvenementRepository evenementRepository;
    private final MatchEquipeRepository matchEquipeRepository;
    private final ParticipationRepository participationRepository;


    public void delete(long id) {
        evenementRepository.deleteById(id);
    }


    public void terminerMatch(long id) {

        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("match invalide"));
        if(match.isResultatCalcule()){
            throw new RuntimeException("Match deja terminé");
        }

        match.setStatut(StatutMatch.TERMINE);
        matchRepository.save(match);


        applyMatchToParticipation(match);
        match.setResultatCalcule(true);
        matchRepository.save(match);
    }


    public void ajouterEvenement(AjouterEventDTO dto) {

        Match match = matchRepository.findById(dto.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match introuvable"));

        Joueur joueur = joueurRepository.findById(dto.getJoueurId())
                .orElseThrow(() -> new RuntimeException("Joueur introuvable"));
        if(match.isResultatCalcule()){
            throw new RuntimeException("Match deja terminé");
        }

        if (dto.getMinute() < 0 || dto.getMinute() > 130) {
            throw new RuntimeException("Minute invalide");
        }

        if (!isJoueurDansMatch(joueur, match)) {
            throw new RuntimeException("Joueur n'appartient pas à ce match");
        }

        boolean dejaRouge = cartonRepository
                .existsByMatchAndJoueurAndType(match, joueur, TypeCarton.ROUGE);

        if (dejaRouge) {
            throw new RuntimeException("Joueur déjà expulsé");
        }


        EvenementMatch event;

        switch (dto.getType()) {

            case "BUT":
                event = new But();
                break;

            case "JAUNE":
                Carton jaune = new Carton();
                jaune.setType(TypeCarton.JAUNE);
                event = jaune;
                break;

            case "ROUGE":
                Carton rouge = new Carton();
                rouge.setType(TypeCarton.ROUGE);
                event = rouge;
                break;

            default:
                throw new RuntimeException("Type invalide");
        }

        event.setMatch(match);
        event.setJoueur(joueur);
        event.setMinute(dto.getMinute());

        evenementRepository.save(event);


        if (event instanceof Carton carton && carton.getType() == TypeCarton.JAUNE) {

            long nbJaune = evenementRepository
                    .countJaunesByJoueurAndMatch(joueur.getId(), match.getId());

            if (nbJaune >= 2) {

                Carton rougeAuto = new Carton();
                rougeAuto.setType(TypeCarton.ROUGE);
                rougeAuto.setMatch(match);
                rougeAuto.setJoueur(joueur);
                rougeAuto.setMinute(dto.getMinute());

                evenementRepository.save(rougeAuto);
            }
        }
    }


    public List<EventResponseDTO> getEventsByMatch(Long matchId) {

        return evenementRepository
                .findByMatchIdOrderByMinuteAsc(matchId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }


    private void applyMatchToParticipation(Match match) {

        Tournoi tournoi = match.getTournoi();

        List<EvenementMatch> events =
                evenementRepository.findByMatchIdOrderByMinuteAsc(match.getId());

        Equipe home = match.getMatchEquipes().get(0).getEquipe();
        Equipe away = match.getMatchEquipes().get(1).getEquipe();

        int homeGoals = 0;
        int awayGoals = 0;

        for (EvenementMatch e : events) {
            if (e instanceof But) {
                if (e.getJoueur().getEquipe().getId().equals(home.getId())) {
                    homeGoals++;
                } else {
                    awayGoals++;
                }
            }
        }
        System.out.println("awwwwaaaaaaaayyyyy :::" +away.getId());
        Participation pHome = participationRepository.findByEquipeAndTournoi(home, tournoi).orElseThrow();
        Participation pAway = participationRepository
                .findByEquipeAndTournoi(away, tournoi)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Participation introuvable pour equipe "
                                        + away.getId()
                                        + " dans tournoi "
                                        + tournoi.getId()
                        ));




        pHome.setButsMarques(pHome.getButsMarques() + homeGoals);
        pHome.setButsEncaisses(pHome.getButsEncaisses() + awayGoals);

        pAway.setButsMarques(pAway.getButsMarques() + awayGoals);
        pAway.setButsEncaisses(pAway.getButsEncaisses() + homeGoals);

        pHome.setDifferenceButs(pHome.getButsMarques() - pHome.getButsEncaisses());
        pAway.setDifferenceButs(pAway.getButsMarques() - pAway.getButsEncaisses());


        if (homeGoals > awayGoals) {

            pHome.setNbVictoires(pHome.getNbVictoires() + 1);
            pHome.setPoints(pHome.getPoints() + 3);

            pAway.setNbDefaites(pAway.getNbDefaites() + 1);

        } else if (homeGoals < awayGoals) {

            pAway.setNbVictoires(pAway.getNbVictoires() + 1);
            pAway.setPoints(pAway.getPoints() + 3);

            pHome.setNbDefaites(pHome.getNbDefaites() + 1);

        } else {

            pHome.setNbNuls(pHome.getNbNuls() + 1);
            pAway.setNbNuls(pAway.getNbNuls() + 1);

            pHome.setPoints(pHome.getPoints() + 1);
            pAway.setPoints(pAway.getPoints() + 1);
        }

        participationRepository.save(pHome);
        participationRepository.save(pAway);
    }


    private EventResponseDTO mapToDTO(EvenementMatch event) {

        String type;

        if (event instanceof But) {
            type = "BUT";
        } else if (event instanceof Carton carton) {
            type = carton.getType().name();
        } else {
            type = "UNKNOWN";
        }

        return new EventResponseDTO(
                event.getId(),
                event.getJoueur().getId(),
                event.getJoueur().getNom(),
                event.getJoueur().getEquipe().getId(),
                event.getJoueur().getEquipe().getNom(),
                type,
                event.getMinute()
        );
    }


    private boolean isJoueurDansMatch(Joueur joueur, Match match) {

        return match.getMatchEquipes().stream()
                .anyMatch(me ->
                        me.getEquipe().getId().equals(
                                joueur.getEquipe() != null
                                        ? joueur.getEquipe().getId()
                                        : null
                        )
                );
    }
}