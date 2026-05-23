package org.example.football.entites;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "but")
@Data
@NoArgsConstructor

@EqualsAndHashCode(callSuper = true)
public class But extends EvenementMatch {
}
