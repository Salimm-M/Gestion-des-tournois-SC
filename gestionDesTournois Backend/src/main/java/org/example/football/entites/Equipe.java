package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "equipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"joueurs", "responsable", "participations", "matchEquipes"})
@EqualsAndHashCode(exclude = {"joueurs", "responsable", "participations", "matchEquipes"})
public class Equipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomEcole;
    private String Abbreviation;

    private String nom;


    private byte[] logo;

    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL)
    private List<Joueur> joueurs;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "responsable_id")
    private Responsable responsable;

    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL)
    private List<Participation> participations;

    @OneToMany(mappedBy = "equipe", cascade = CascadeType.ALL)
    private List<MatchEquipe> matchEquipes;
}
