package org.example.football.repository;


import org.example.football.Enum.TypeCarton;
import org.example.football.entites.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EvenementRepository extends JpaRepository<EvenementMatch, Long> {



    List<EvenementMatch> findByMatchIdOrderByMinuteAsc(Long matchId);


    @Query("""
        SELECT COUNT(e) FROM Carton e
        WHERE e.joueur.id = :joueurId
        AND e.match.id = :matchId
        AND e.type = 'JAUNE'
    """)
    long countJaunesByJoueurAndMatch(Long joueurId, Long matchId);
}