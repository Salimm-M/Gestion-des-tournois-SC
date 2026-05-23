package org.example.football.controller;



import lombok.RequiredArgsConstructor;
import org.example.football.dto.match.MatchResponseDTO;
import org.example.football.dto.match.PlanifierMatchDTO;

import org.example.football.service.MatchService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;


    @PostMapping("/generate/{tournoiId}")
    public void genererMatchs(@PathVariable Long tournoiId) {
        matchService.processTournament(tournoiId);
    }


    @GetMapping
    public List<MatchResponseDTO> getAll() {
        return matchService.getAll();
    }
    @GetMapping("/stade/{stadeId}/slots")
    public List<LocalTime> getAvailableSlots(
            @PathVariable Long stadeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return matchService.getAvailableSlots(stadeId, date);
    }

    @PostMapping("/planifier")
    public void planifierMatch(@RequestBody PlanifierMatchDTO plMatch){
        matchService.planifierMatch(plMatch);

    }
    @GetMapping("/tournoi/{id}")
    public ResponseEntity<List<MatchResponseDTO>> getMatches(@PathVariable Long id){
        return ResponseEntity.ok(matchService.getMatchesByTournoi(id));

    }
    @GetMapping("/tournoi/{id}/equipe/{idequipe}")
    public ResponseEntity<List<MatchResponseDTO>> getMatchByEquipeAndTournoi(@PathVariable Long id, @PathVariable Long idequipe){
        return ResponseEntity.ok(matchService.getMatchByEquipeIdAndTournoiId(id, idequipe));

    }
    @GetMapping("/{id}")
    public ResponseEntity<MatchResponseDTO> getMatchById(@PathVariable Long id){
        return ResponseEntity.ok(matchService.getMatchById(id));

    }

}
