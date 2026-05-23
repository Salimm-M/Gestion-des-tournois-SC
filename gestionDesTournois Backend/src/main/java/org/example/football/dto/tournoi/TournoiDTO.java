package org.example.football.dto.tournoi;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.football.Enum.StatutTournois;
import org.example.football.Enum.TypeTournoi;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TournoiDTO {
    private Long id;
    private String nom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private int nbEquipes;
    private int nbParticipations;
    private TypeTournoi typeTournoi;
    private StatutTournois statut;
    private boolean ouvert;
    private boolean estLance;
    private int nbJoueurSurTerrain;
}