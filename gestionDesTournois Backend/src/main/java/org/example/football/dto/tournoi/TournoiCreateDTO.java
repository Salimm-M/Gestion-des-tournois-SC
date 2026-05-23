package org.example.football.dto.tournoi;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.football.Enum.TypeTournoi;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournoiCreateDTO {
    private String nom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private int nbEquipes;
    private TypeTournoi typeTournoi;
    private int nbJoueurSurTerrain;
}