package org.example.football.dto;


import lombok.Data;
import org.example.football.Enum.Role;

import java.util.Date;

@Data
public class UserDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;



    private Role role;
}
