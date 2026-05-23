package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;



import java.time.LocalDate;
import java.util.List;
import org.example.football.Enum.StatutTournois;
import org.example.football.Enum.TypeTournoi;
@Entity
@Table(name = "tournoi")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"matchs", "participations"})
@EqualsAndHashCode(exclude = {"matchs", "participations"})
public class Tournoi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    private int nbEquipes;

    private int nbParticipations;

    private int nbJoueurSurTerrain;


    @Enumerated(EnumType.STRING)
    private TypeTournoi typeTournoi;

    @Enumerated(EnumType.STRING)
    private StatutTournois    statut = StatutTournois.EN_ATTENTE;

    private boolean ouvert = true;

    private boolean estLance = false;





    @OneToMany(mappedBy = "tournoi", cascade = CascadeType.ALL)
    private List<Match> matchs;

    @OneToMany(mappedBy = "tournoi", cascade = CascadeType.ALL)
    private List<Participation> participations;
}