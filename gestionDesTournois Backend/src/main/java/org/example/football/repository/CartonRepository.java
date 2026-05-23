package org.example.football.repository;

import org.example.football.Enum.TypeCarton;
import org.example.football.entites.Carton;
import org.example.football.entites.Joueur;
import org.example.football.entites.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartonRepository extends JpaRepository<Carton, Long> {

    boolean existsByMatchAndJoueurAndType(
            Match match,
            Joueur joueur,
            TypeCarton type
    );
}
