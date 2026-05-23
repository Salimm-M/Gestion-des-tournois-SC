package org.example.football.service;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AllArgsConstructor;
import org.example.football.dto.CreateUserDto;
import org.example.football.dto.UserDto;
import org.example.football.entites.Admin;
import org.example.football.entites.Agent;
import org.example.football.entites.Responsable;
import org.example.football.entites.User;
import org.example.football.mapper.UserMapper;
import org.example.football.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    public UserDto saveUser( CreateUserDto userDto) {
        User user;
        switch (userDto.getRole()) {
            case Admin -> user=new Admin();
            case Agent ->  user=new Agent();
            case  Responsable ->  user=new Responsable();
            default -> throw new IllegalArgumentException("Invalid role");
        }
        userRepository.findByEmail(userDto.getEmail())
                .ifPresent(u -> {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Email already exists"
                    );
                });
        userMapper.toEntity(userDto,user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return userMapper.mapToDto(user);
    }
    public UserDto patchUser( CreateUserDto dto) {

        User user = userRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("User introuvable"));

        if (dto.getNom() != null) {
            user.setNom(dto.getNom());
        }

        if (dto.getPrenom() != null) {
            user.setPrenom(dto.getPrenom());
        }


        if (dto.getEmail() != null&& !dto.getEmail().equals(user.getEmail())) {
            userRepository.findByEmail(dto.getEmail())
                    .ifPresent(u -> {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Email already exists"
                        );
                    });
            user.setEmail(dto.getEmail());
        }



        User updatedUser = userRepository.save(user);

        UserDto response = new UserDto();
        response.setId(updatedUser.getId());
        response.setNom(updatedUser.getNom());
        response.setPrenom(updatedUser.getPrenom());
        response.setEmail(updatedUser.getEmail());
        response.setRole(updatedUser.getRole());

        return response;
    }
    public List<UserDto> getAll(){
        return userRepository.findAll().stream().map(userMapper::mapToDto).collect(Collectors.toList());
    }
    public void delete(Long id){
         userRepository.deleteById(id);
    }
}
