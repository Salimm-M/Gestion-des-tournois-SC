package org.example.football.mapper;


import org.example.football.dto.tournoi.TournoiCreateDTO;
import org.example.football.dto.tournoi.TournoiDTO;
import org.example.football.entites.Tournoi;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TournoiMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "statut", ignore = true)
    @Mapping(target = "ouvert", ignore = true)
    @Mapping(target = "estLance", ignore = true)
    @Mapping(target = "nbParticipations", ignore = true)
    @Mapping(target = "matchs", ignore = true)
    @Mapping(target = "participations", ignore = true)
    Tournoi toEntity(TournoiCreateDTO dto);


    TournoiDTO toDTO(Tournoi tournoi);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "matchs", ignore = true)
    @Mapping(target = "participations", ignore = true)
    @Mapping(target = "nbParticipations", ignore = true)
    void updateEntity(TournoiDTO dto, @MappingTarget Tournoi tournoi);
}