package org.example.football.controller;



import lombok.RequiredArgsConstructor;
import org.example.football.dto.AjouterEventDTO;
import org.example.football.dto.EventResponseDTO;
import org.example.football.entites.EvenementMatch;
import org.example.football.service.EvenementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EvenementController {

    private final EvenementService evenementService;

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id){
        this.evenementService.delete(id);
    }


    @PostMapping
    public ResponseEntity<String> ajouterEvenement(@RequestBody AjouterEventDTO dto) {

        evenementService.ajouterEvenement(dto);

        return ResponseEntity.ok("Event ajouté avec succès");
    }


    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<EventResponseDTO>> getEventsByMatch(@PathVariable Long matchId) {

        return ResponseEntity.ok(
                evenementService.getEventsByMatch(matchId)
        );
    }
    @PostMapping("/{id}/terminer")
    public void terminer(@PathVariable Long id){
        evenementService.terminerMatch(id);
    }
}
