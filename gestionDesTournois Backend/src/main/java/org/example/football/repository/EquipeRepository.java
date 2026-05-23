package org.example.football.repository;

import org.example.football.entites.Equipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EquipeRepository extends JpaRepository<Equipe,Long> {

    Optional<Equipe> findEquipeByResponsableId(Long responsableId);
    Optional<Equipe> findEquipeById(Long equipeId);
}
