package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.TimerTask;

@Entity
@Table(name = "stade")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "matchs")
@EqualsAndHashCode(exclude = "matchs")
public class Stade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String ville;

    private LocalTime heureOuverture;
    private LocalTime heureFermeture;

    @OneToMany(mappedBy = "stade", cascade = CascadeType.ALL)
    private List<Match> matchs;
}
