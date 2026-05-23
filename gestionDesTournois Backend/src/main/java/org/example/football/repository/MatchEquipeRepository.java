package org.example.football.repository;


import org.example.football.entites.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchEquipeRepository extends JpaRepository<MatchEquipe, Long> {

    MatchEquipe findByMatchAndEquipe(Match match, Equipe equipe);
}
