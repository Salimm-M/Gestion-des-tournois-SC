package org.example.football.dto.stade;

import lombok.Data;

import java.time.LocalTime;

@Data
public class UpdateStadeDTO {

    private Long id;

    private String nom;
    private String ville;

    private LocalTime heureOuverture;
    private LocalTime heureFermeture;
}
