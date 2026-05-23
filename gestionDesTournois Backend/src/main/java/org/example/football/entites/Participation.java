package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "participation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"equipe", "tournoi"})
@EqualsAndHashCode(exclude = {"equipe", "tournoi"})
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int points;
    private int nbVictoires;
    private int nbNuls;
    private int nbDefaites;
    private int butsMarques;
    private int butsEncaisses;
    private int differenceButs;


    @ManyToOne
    @JoinColumn(name = "equipe_id")
    private Equipe equipe;

    @ManyToOne
    @JoinColumn(name = "tournoi_id")
    private Tournoi tournoi;
}
