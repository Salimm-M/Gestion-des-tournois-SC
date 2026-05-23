package org.example.football.dto.equipe;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
@Data
public class ResultatImportJoueur {

    private List<ReponseJoueur> joueurs = new ArrayList<>();

    private List<String> erreurs = new ArrayList<>();

}