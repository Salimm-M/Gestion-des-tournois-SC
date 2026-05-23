package org.example.football.repository;

import org.example.football.entites.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface MatchRepository  extends JpaRepository<Match, Long>
{
    List<Match> findByStadeIdAndDateMatch(Long stade_id, LocalDate dateMatch);
    List<Match> findByTournoi_Id(Long tournoi_id);
    List<Match> findByTournoiIdAndMatchEquipesEquipeId(Long tournoiId, Long equipeId);

    boolean  existsByStadeIdAndDateMatchAndHeureDebut(Long stadeId, LocalDate dateMatch, LocalTime heureDebut);
}
