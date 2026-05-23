package org.example.football.service;

import lombok.AllArgsConstructor;
import org.example.football.dto.equipe.CreateEquipe;
import org.example.football.dto.equipe.ReponseEquipe;
import org.example.football.entites.Equipe;
import org.example.football.entites.Responsable;
import org.example.football.entites.User;
import org.example.football.mapper.EquipeMapper;
import org.example.football.repository.EquipeRepository;
import org.example.football.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EquipeService {
    private final EquipeRepository equipeRepository;
    private final EquipeMapper equipeMapper;
    private final UserRepository userRepository;
    public ReponseEquipe createEquipe(CreateEquipe equipeDTO) {
        Equipe equipe = equipeMapper.toEntity(equipeDTO);
        if(equipeDTO.getIdResponsable()!=null){
            User user = userRepository.findById(equipeDTO.getIdResponsable()).orElseThrow(() -> new RuntimeException("Responsable not found"));;
            equipe.setResponsable((Responsable) user);
        }

        equipeRepository.save(equipe);
        return equipeMapper.toResponse(equipe);




    }
    public List<ReponseEquipe> getAll(){
        return equipeRepository.findAll().stream().map(equipeMapper::toResponse).collect(Collectors.toList());
    }
    public ReponseEquipe getEquipeById(Long equipeId) {
        return this.equipeMapper.toResponse(this.equipeRepository.findById(equipeId).orElseThrow(() -> new RuntimeException("Equipe not found")));
    }
    public ReponseEquipe getEquipeByResponsableId(Long equipeId) {
        Responsable user =(Responsable) userRepository.findById(equipeId).orElseThrow(() -> new RuntimeException("User not found"));;
        return this.equipeMapper.toResponse(user.getEquipe());
    }

}
