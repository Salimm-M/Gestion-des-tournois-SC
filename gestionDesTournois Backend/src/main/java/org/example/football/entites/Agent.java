package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@DiscriminatorValue("AGENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = "evenements")
public class Agent extends User {

    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    private List<EvenementMatch> evenements;
}
