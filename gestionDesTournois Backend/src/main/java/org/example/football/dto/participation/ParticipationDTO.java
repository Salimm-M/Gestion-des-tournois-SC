package org.example.football.dto.participation;



import lombok.*;
import org.example.football.Enum.StatutTournois;
import org.example.football.Enum.TypeTournoi;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipationDTO {
    private Long id;
    private int points;
    private int nbVictoires;
    private int nbNuls;
    private int nbDefaites;
    private int butsMarques;
    private int butsEncaisses;
    private int differenceButs;

    private Long equipeId;
    private String equipeNom;

    private Long tournoiId;
    private String tournoiNom;
    private TypeTournoi tournoiType;
    private StatutTournois tournoiStatut;
    private LocalDate tournoiDateDebut;
    private LocalDate tournoiDateFin;
    private boolean tournoiEstLance;
}