package org.example.football.dto.equipe;

import lombok.Data;

import java.time.LocalDate;
@Data
public class ReponseJoueur {
    private Long id;
    private String nom;
    private String prenom;

    private LocalDate dateNaiss;
    private String poste;
    private Long idEquipe;
}
