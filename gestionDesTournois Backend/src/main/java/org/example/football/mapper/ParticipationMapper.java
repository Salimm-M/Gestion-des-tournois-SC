package org.example.football.mapper;
import org.example.football.dto.Classement;
import org.example.football.dto.participation.ParticipationCreateDTO;
import org.example.football.entites.Participation;

import org.example.football.dto.participation.ParticipationDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ParticipationMapper {

    @Mapping(target = "equipeId",        source = "equipe.id")
    @Mapping(target = "equipeNom",       source = "equipe.nom")
    @Mapping(target = "tournoiId",       source = "tournoi.id")
    @Mapping(target = "tournoiNom",      source = "tournoi.nom")
    @Mapping(target = "tournoiType",     source = "tournoi.typeTournoi")
    @Mapping(target = "tournoiStatut",   source = "tournoi.statut")
    @Mapping(target = "tournoiDateDebut",source = "tournoi.dateDebut")
    @Mapping(target = "tournoiDateFin",  source = "tournoi.dateFin")
    @Mapping(target = "tournoiEstLance", source = "tournoi.estLance")
    ParticipationDTO toDTO(Participation participation);

    @Mapping(target = "equipeId",        source = "equipe.id")
    @Mapping(target = "equipeNom",       source = "equipe.nom")
    Classement ToClassement(Participation participation);

    @Mapping(target = "equipe",  ignore = true)
    @Mapping(target = "tournoi", ignore = true)
    Participation toEntity(ParticipationCreateDTO dto);
}
