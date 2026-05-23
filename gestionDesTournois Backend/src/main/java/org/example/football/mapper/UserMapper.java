package org.example.football.mapper;

import org.example.football.dto.CreateUserDto;
import org.example.football.entites.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.example.football.dto.UserDto;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;


@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto mapToDto(User user);



    void toEntity(CreateUserDto dto, @MappingTarget User user);
    void toEntity(UserDto dto, @MappingTarget User user);
}