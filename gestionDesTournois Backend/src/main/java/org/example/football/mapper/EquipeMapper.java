package org.example.football.mapper;

import org.example.football.dto.equipe.CreateEquipe;
import org.example.football.dto.equipe.ReponseEquipe;
import org.example.football.entites.Equipe;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EquipeMapper {

    @Mapping(target = "responsable", ignore = true)
    Equipe toEntity(CreateEquipe dto);
    @Mapping(source = "responsable.id", target = "idResponsable")
    ReponseEquipe toResponse(Equipe equipe);
}
