package org.example.football.service;

import lombok.RequiredArgsConstructor;
import org.example.football.dto.stade.CreateStadeDTO;
import org.example.football.dto.stade.StadeResponseDTO;
import org.example.football.dto.stade.UpdateStadeDTO;
import org.example.football.entites.Stade;
import org.example.football.mapper.StadeMapper;
import org.example.football.repository.StadeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StadeServiceImpl  {

    private final StadeRepository repository;
    private final StadeMapper mapper;


    public StadeResponseDTO create(CreateStadeDTO dto) {


        if (dto.getHeureOuverture().isAfter(dto.getHeureFermeture())) {
            throw new RuntimeException("Heure ouverture doit être avant fermeture");
        }

        Stade stade = mapper.toEntity(dto);

        return mapper.toDTO(repository.save(stade));
    }


    public StadeResponseDTO update(Long id, UpdateStadeDTO dto) {

        Stade stade = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stade not found"));


        if (dto.getHeureOuverture() != null &&
                dto.getHeureFermeture() != null &&
                dto.getHeureOuverture().isAfter(dto.getHeureFermeture())) {

            throw new RuntimeException("Heure ouverture doit être avant fermeture");
        }

        mapper.updateStadeFromDto(dto, stade);

        return mapper.toDTO(repository.save(stade));
    }


    public StadeResponseDTO getById(Long id) {

        Stade stade = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stade not found"));

        return mapper.toDTO(stade);
    }


    public List<StadeResponseDTO> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }


    public void delete(Long id) {

        Stade stade = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stade not found"));

        repository.delete(stade);
    }
}
