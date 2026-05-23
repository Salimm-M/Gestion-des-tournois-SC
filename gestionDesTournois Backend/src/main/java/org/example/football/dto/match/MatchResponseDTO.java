package org.example.football.dto.match;



import lombok.Builder;
import lombok.Data;
import org.example.football.Enum.StatutMatch;
import org.example.football.dto.equipe.ReponseEquipe;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
public class MatchResponseDTO {

    private Long id;
    private int journee;
    private LocalDate dateMatch;
    private StatutMatch statut;
    private LocalTime heureDebut;
    private ReponseEquipe equipeDomicile;
    private ReponseEquipe equipeExterieur;

    private int scoreDomicile;
    private int scoreExterieur;
}