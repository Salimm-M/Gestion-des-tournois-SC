package org.example.football.service;

import lombok.RequiredArgsConstructor;

import org.example.football.Enum.StatutTournois;
import org.example.football.dto.Classement;
import org.example.football.dto.participation.ParticipationCreateDTO;
import org.example.football.dto.participation.ParticipationDTO;
import org.example.football.dto.tournoi.TournoiDTO;
import org.example.football.entites.*;
import org.example.football.mapper.ParticipationMapper;
import org.example.football.mapper.TournoiMapper;
import org.example.football.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final EquipeRepository equipeRepository;
    private final TournoiRepository tournoiRepository;
    private final ParticipationMapper participationMapper;
    private final TournoiMapper tournoiMapper;

    public List<ParticipationDTO> getByEquipe(Long equipeId) {
        return participationRepository.findByEquipeId(equipeId)
                .stream()
                .map(participationMapper::toDTO)
                .collect(Collectors.toList());
    }
    public ParticipationDTO rejoindre(ParticipationCreateDTO dto) {
        Equipe equipe = equipeRepository.findById(dto.getEquipeId())
                .orElseThrow(() -> new RuntimeException("Équipe non trouvée"));

        Tournoi tournoi = tournoiRepository.findById(dto.getTournoiId())
                .orElseThrow(() -> new RuntimeException("Tournoi non trouvé"));
        if(equipe.getJoueurs().size()<tournoi.getNbJoueurSurTerrain()){
            throw new RuntimeException("nombre de joueur invalide");
        }

        if (!tournoi.isOuvert()) {
            throw new RuntimeException("Ce tournoi n'accepte plus de participations");
        }

        if (tournoi.getNbParticipations() >= tournoi.getNbEquipes()) {
            throw new RuntimeException("Le tournoi est complet");
        }

        if (participationRepository.existsByEquipeIdAndTournoiId(dto.getEquipeId(), dto.getTournoiId())) {
            throw new RuntimeException("Votre équipe participe déjà à ce tournoi");
        }

        Participation participation = new Participation();
        participation.setEquipe(equipe);
        participation.setTournoi(tournoi);
        participation.setPoints(0);
        participation.setNbVictoires(0);
        participation.setNbNuls(0);
        participation.setNbDefaites(0);
        participation.setButsMarques(0);
        participation.setButsEncaisses(0);
        participation.setDifferenceButs(0);

        tournoi.setNbParticipations(tournoi.getNbParticipations() + 1);
        if (tournoi.getNbParticipations() >= tournoi.getNbEquipes()) {
            tournoi.setStatut(StatutTournois.COMPLET);
            tournoi.setOuvert(false);
        }
        tournoiRepository.save(tournoi);

        return participationMapper.toDTO(participationRepository.save(participation));
    }


    public List<TournoiDTO> getTournoisDisponibles(Long equipeId) {
        List<Long> dejaDans = participationRepository.findByEquipeId(equipeId)
                .stream()
                .map(p -> p.getTournoi().getId())
                .collect(Collectors.toList());

        return tournoiRepository.findAll()
                .stream()
                .filter(t -> t.isOuvert() && !dejaDans.contains(t.getId())&&t.getStatut()==StatutTournois.EN_ATTENTE)
                .map(tournoiMapper::toDTO)
                .collect(Collectors.toList());
    }
    public List<Classement> getClassement(Long idTournoi){
        return participationRepository.findByTournoi_IdOrderByPointsDesc(idTournoi).stream().map(participationMapper::ToClassement).collect(Collectors.toList());
    }


    public List<TournoiDTO> getTournoisRejoint(Long equipeId) {
        return participationRepository.findByEquipeId(equipeId)
                .stream()
                .map(p -> tournoiMapper.toDTO(p.getTournoi()))
                .collect(Collectors.toList());
    }


    public void quitter(Long participationId) {
        Participation p = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation non trouvée"));

        Tournoi tournoi = p.getTournoi();
        if (tournoi.isEstLance()) {
            throw new RuntimeException("Impossible de quitter un tournoi déjà lancé");
        }

        tournoi.setNbParticipations(tournoi.getNbParticipations() - 1);
        tournoi.setOuvert(true);
        tournoi.setStatut(StatutTournois.EN_ATTENTE);
        tournoiRepository.save(tournoi);

        participationRepository.deleteById(participationId);
    }
}