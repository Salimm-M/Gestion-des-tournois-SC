package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@DiscriminatorValue("ADMIN")
@Data
@NoArgsConstructor

@EqualsAndHashCode(callSuper = true)

public class Admin extends User {



}
