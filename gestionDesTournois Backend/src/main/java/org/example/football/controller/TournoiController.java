package org.example.football.controller;

import lombok.RequiredArgsConstructor;

import org.example.football.dto.tournoi.TournoiCreateDTO;
import org.example.football.dto.tournoi.TournoiDTO;
import org.example.football.service.TournoiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournois")
@RequiredArgsConstructor
public class TournoiController {

    private final TournoiService tournoiService;

    @PostMapping
    public ResponseEntity<TournoiDTO> create(@RequestBody TournoiCreateDTO dto) {
        return ResponseEntity.ok(tournoiService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournoiDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<TournoiDTO>> getAll() {
        return ResponseEntity.ok(tournoiService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TournoiDTO> update(@PathVariable Long id, @RequestBody TournoiDTO dto) {
        return ResponseEntity.ok(tournoiService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tournoiService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/lancer")
    public ResponseEntity<TournoiDTO> lancer(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.lancerTournoi(id));
    }

    @PatchMapping("/{id}/fermer-inscriptions")
    public ResponseEntity<TournoiDTO> fermerInscriptions(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.fermerInscriptions(id));
    }
}