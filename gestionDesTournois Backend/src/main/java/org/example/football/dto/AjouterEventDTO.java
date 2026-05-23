package org.example.football.dto;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AjouterEventDTO {

    private Long matchId;
    private Long joueurId;


    private String type;

    private int minute;
}
