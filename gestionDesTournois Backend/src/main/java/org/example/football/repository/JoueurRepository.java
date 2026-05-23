package org.example.football.repository;

import org.example.football.entites.Joueur;
import org.example.football.entites.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import javax.swing.*;
import java.util.List;
import java.util.Optional;

public interface JoueurRepository extends JpaRepository <Joueur, Long> {
    List<Joueur> findByEquipe_Responsable_Id(Long reponsableId);
    List<Joueur> findByEquipeId(Long equipeId);
}
