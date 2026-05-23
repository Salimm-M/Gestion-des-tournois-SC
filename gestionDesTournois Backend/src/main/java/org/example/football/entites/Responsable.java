package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("RESPONSABLE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = "equipe")
public class Responsable extends User {

    @OneToOne(mappedBy = "responsable")
    private Equipe equipe;
}
