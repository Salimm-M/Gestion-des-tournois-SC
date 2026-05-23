package org.example.football.service;

import lombok.RequiredArgsConstructor;
import org.example.football.Enum.StatutTournois;

import org.example.football.dto.tournoi.TournoiCreateDTO;
import org.example.football.dto.tournoi.TournoiDTO;
import org.example.football.entites.Tournoi;
import org.example.football.mapper.TournoiMapper;

import org.example.football.repository.TournoiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournoiService  {

    private final TournoiRepository tournoiRepository;
    private final TournoiMapper tournoiMapper;


    public TournoiDTO create(TournoiCreateDTO dto) {
        Tournoi tournoi = tournoiMapper.toEntity(dto);
        return tournoiMapper.toDTO(tournoiRepository.save(tournoi));
    }


    public TournoiDTO getById(Long id) {
        Tournoi tournoi = tournoiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournoi non trouvé avec id: " + id));
        return tournoiMapper.toDTO(tournoi);
    }


    public List<TournoiDTO> getAll() {
        return tournoiRepository.findAll()
                .stream()
                .map(tournoiMapper::toDTO)
                .collect(Collectors.toList());
    }


    public TournoiDTO update(Long id, TournoiDTO dto) {
        Tournoi existing = tournoiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournoi non trouvé avec id: " + id));
        tournoiMapper.updateEntity(dto, existing); // MapStruct applique les champs directement
        return tournoiMapper.toDTO(tournoiRepository.save(existing));
    }


    public void delete(Long id) {
        tournoiRepository.deleteById(id);
    }


    public TournoiDTO lancerTournoi(Long id) {
        Tournoi tournoi = tournoiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournoi non trouvé avec id: " + id));
        tournoi.setEstLance(true);
        tournoi.setOuvert(false);
        tournoi.setStatut(StatutTournois.EN_COURS);
        return tournoiMapper.toDTO(tournoiRepository.save(tournoi));
    }


    public TournoiDTO fermerInscriptions(Long id) {
        Tournoi tournoi = tournoiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournoi non trouvé avec id: " + id));
        tournoi.setOuvert(false);
        tournoi.setStatut(StatutTournois.COMPLET);
        return tournoiMapper.toDTO(tournoiRepository.save(tournoi));
    }
}