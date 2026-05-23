package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import org.example.football.Enum.RoleEquipe;

@Entity
@Table(name = "match_equipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"match", "equipe"})
@EqualsAndHashCode(exclude = {"match", "equipe"})
public class MatchEquipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;

    @Enumerated(EnumType.STRING)
    private RoleEquipe role;

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne
    @JoinColumn(name = "equipe_id")
    private Equipe equipe;
}
