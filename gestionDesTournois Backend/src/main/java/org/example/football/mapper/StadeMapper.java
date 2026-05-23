package org.example.football.mapper;

import org.example.football.dto.stade.CreateStadeDTO;
import org.example.football.dto.stade.StadeResponseDTO;
import org.example.football.dto.stade.UpdateStadeDTO;
import org.example.football.entites.Match;
import org.example.football.entites.Stade;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StadeMapper {


    Stade toEntity(CreateStadeDTO dto);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateStadeFromDto(UpdateStadeDTO dto, @MappingTarget Stade stade);


    @Mapping(target = "matchIds", source = "matchs")
    StadeResponseDTO toDTO(Stade stade);


    default List<Long> map(List<Match> matchs) {
        if (matchs == null) return null;
        return matchs.stream()
                .map(Match::getId)
                .toList();
    }
}