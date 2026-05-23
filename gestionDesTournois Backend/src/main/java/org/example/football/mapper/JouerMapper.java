package org.example.football.mapper;

import org.example.football.dto.equipe.CreateEquipe;
import org.example.football.dto.equipe.CreateJoueurDTO;
import org.example.football.dto.equipe.ReponseEquipe;
import org.example.football.dto.equipe.ReponseJoueur;
import org.example.football.entites.Equipe;
import org.example.football.entites.Joueur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JouerMapper {
    @Mapping(target = "equipe", ignore = true)
    Joueur toEntity(CreateJoueurDTO dto);

    @Mapping(source = "equipe.id", target = "idEquipe")
    ReponseJoueur toResponse(Joueur j);

}
