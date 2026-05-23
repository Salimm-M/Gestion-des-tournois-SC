package org.example.football.dto;

import lombok.Data;

@Data
public class Classement {
    private Long id;
    private String equipeNom;
    private int equipeId;
    private int points;
    private int nbVictoires;
    private int nbNuls;
    private int nbDefaites;
    private int butsMarques;
    private int butsEncaisses;
    private int differenceButs;
}
