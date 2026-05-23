package org.example.football.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO {

    private Long id;

    private Long joueurId;
    private String joueurNom;

    private Long equipeId;
    private String equipeNom;

    private String type; // BUT / JAUNE / ROUGE

    private int minute;
}