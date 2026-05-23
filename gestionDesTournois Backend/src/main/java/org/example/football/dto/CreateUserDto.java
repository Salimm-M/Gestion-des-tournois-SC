package org.example.football.dto;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.football.Enum.Role;

import java.util.Date;

@Getter
@Setter
public class CreateUserDto {

    private Long id;

    private String nom;
    private String prenom;
    private String password;

    private Role role;
    private String email;
}
