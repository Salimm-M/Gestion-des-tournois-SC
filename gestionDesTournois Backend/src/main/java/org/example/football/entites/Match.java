package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import org.example.football.Enum.StatutMatch;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "match_football")
@Data
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"matchEquipes", "evenements"})
@EqualsAndHashCode(exclude = {"matchEquipes", "evenements"})
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private LocalDate dateMatch;
    private int journee;

    @Enumerated(EnumType.STRING)
    private StatutMatch statut;

    private LocalTime heureDebut;
    private boolean resultatCalcule = false;

    @ManyToOne
    @JoinColumn(name = "tournoi_id")
    private Tournoi tournoi;

    @ManyToOne
    @JoinColumn(name = "stade_id")
    private Stade stade;



    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<MatchEquipe> matchEquipes;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL)
    private List<EvenementMatch> evenements;
}
