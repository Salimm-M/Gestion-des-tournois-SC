package org.example.football.repository;


import org.example.football.entites.Equipe;
import org.example.football.entites.Participation;
import org.example.football.entites.Tournoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    List<Participation> findByEquipeId(Long equipeId);
    List<Participation> findByTournoiId(Long tournoiId);
    boolean existsByEquipeIdAndTournoiId(Long equipeId, Long tournoiId);
    List<Participation> findByTournoi_IdOrderByPointsDesc(Long tournoiId);

    Optional<Participation> findByEquipeAndTournoi(Equipe equipe, Tournoi tournoi);
}
