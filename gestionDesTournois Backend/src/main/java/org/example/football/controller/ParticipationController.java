package org.example.football.controller;


import lombok.RequiredArgsConstructor;

import org.example.football.dto.Classement;
import org.example.football.dto.participation.ParticipationCreateDTO;
import org.example.football.dto.participation.ParticipationDTO;
import org.example.football.dto.tournoi.TournoiDTO;
import org.example.football.service.ParticipationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;
    @GetMapping("/equipe/{equipeId}")
    public ResponseEntity<List<ParticipationDTO>> getByEquipe(@PathVariable Long equipeId) {
        return ResponseEntity.ok(participationService.getByEquipe(equipeId));
    }
    @PostMapping("/rejoindre")
    public ResponseEntity<ParticipationDTO> rejoindre(@RequestBody ParticipationCreateDTO dto) {
        return ResponseEntity.ok(participationService.rejoindre(dto));
    }

    @GetMapping("/disponibles/{equipeId}")
    public ResponseEntity<List<TournoiDTO>> getDisponibles(@PathVariable Long equipeId) {
        return ResponseEntity.ok(participationService.getTournoisDisponibles(equipeId));
    }

    @GetMapping("/rejoint/{equipeId}")
    public ResponseEntity<List<TournoiDTO>> getRejoint(@PathVariable Long equipeId) {
        return ResponseEntity.ok(participationService.getTournoisRejoint(equipeId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> quitter(@PathVariable Long id) {
        participationService.quitter(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}/classement")
    public ResponseEntity<List<Classement>> getClassement(@PathVariable Long id) {
        return  ResponseEntity.ok(participationService.getClassement(id));
    }
}
