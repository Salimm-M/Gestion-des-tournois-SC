package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@DiscriminatorValue("JOUEUR")
@Data
@NoArgsConstructor
@AllArgsConstructor

@ToString(callSuper = true, exclude = {"equipe", "evenements"})
public class Joueur  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    private LocalDate dateNaiss;
    private String poste;

    @ManyToOne
    @JoinColumn(name = "equipe_id")
    private Equipe equipe;

    @OneToMany(mappedBy = "joueur", cascade = CascadeType.ALL)
    private List<EvenementMatch> evenements;
}
