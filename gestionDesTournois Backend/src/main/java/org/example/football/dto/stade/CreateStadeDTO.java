package org.example.football.dto.stade;

import lombok.Data;

import java.time.LocalTime;

@Data
public class CreateStadeDTO {

    private String nom;
    private String ville;

    private LocalTime heureOuverture;
    private LocalTime heureFermeture;
}