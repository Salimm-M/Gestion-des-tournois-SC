package org.example.football.entites;


import jakarta.persistence.*;
import lombok.*;
import org.example.football.Enum.TypeCarton;

@Entity
@Table(name = "carton")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Carton extends EvenementMatch {

    @Enumerated(EnumType.STRING)
    private TypeCarton type;
}
