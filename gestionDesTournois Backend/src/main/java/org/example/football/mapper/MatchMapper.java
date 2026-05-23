package org.example.football.mapper;

import lombok.AllArgsConstructor;
import org.example.football.dto.equipe.ReponseEquipe;
import org.example.football.dto.match.MatchResponseDTO;

import org.example.football.entites.Match;
import org.example.football.entites.MatchEquipe;
import org.example.football.Enum.RoleEquipe;
import org.mapstruct.Mapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class MatchMapper {
   private EquipeMapper equipeMapper;

    public  MatchResponseDTO toDTO(Match match) {

        MatchEquipe home = match.getMatchEquipes().stream()
                .filter(me -> me.getRole() == RoleEquipe.DOMICILE)
                .findFirst()
                .orElse(null);

        MatchEquipe away = match.getMatchEquipes().stream()
                .filter(me -> me.getRole() == RoleEquipe.EXTERIEUR)
                .findFirst()
                .orElse(null);

        return MatchResponseDTO.builder()
                .id(match.getId())
                .journee(match.getJournee())
                .dateMatch(match.getDateMatch())
                .statut(match.getStatut())
                .heureDebut(match.getHeureDebut())

                .equipeDomicile(equipeMapper.toResponse(home.getEquipe()))
                .equipeExterieur(equipeMapper.toResponse(away.getEquipe()))

                .scoreDomicile(home != null ? home.getScore() : 0)
                .scoreExterieur(away != null ? away.getScore() : 0)

                .build();
    }



}