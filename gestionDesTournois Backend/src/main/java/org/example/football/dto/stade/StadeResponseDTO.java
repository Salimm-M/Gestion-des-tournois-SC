package org.example.football.dto.stade;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class StadeResponseDTO {

    private Long id;

    private String nom;
    private String ville;

    private LocalTime heureOuverture;
    private LocalTime heureFermeture;


    private List<Long> matchIds;
}