package org.example.football.dto.equipe;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReponseEquipe {
    private Long id;
    private String Abbréviation;

    private String nom;
    private String pays;

    private byte[] logo;



    private Long idResponsable;
}
