package org.example.football.dto.equipe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.example.football.entites.Joueur;
import org.example.football.entites.MatchEquipe;
import org.example.football.entites.Participation;
import org.example.football.entites.Responsable;

import java.util.List;
@Data
public class CreateEquipe {


    private String Abbreviation;

    private String nom;
    private String nomEcole;
    private String pays;

    private byte[] logo;



    private Long idResponsable;



}
