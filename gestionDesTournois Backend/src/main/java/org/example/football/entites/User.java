package org.example.football.entites;

import jakarta.persistence.*;
import lombok.*;
import org.example.football.Enum.Role;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)

@Table(name = "utilisateur")
@DiscriminatorColumn(name = "type_utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String password;

    private String confirmCode;


    @Column(unique = true,nullable = false)
    private String email;

}
