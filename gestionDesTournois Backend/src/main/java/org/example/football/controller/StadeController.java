package org.example.football.controller;

import lombok.RequiredArgsConstructor;
import org.example.football.dto.stade.CreateStadeDTO;
import org.example.football.dto.stade.StadeResponseDTO;
import org.example.football.dto.stade.UpdateStadeDTO;
import org.example.football.service.StadeServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stades")
@RequiredArgsConstructor
public class StadeController {

    private final StadeServiceImpl service;


    @PostMapping
    public ResponseEntity<StadeResponseDTO> create(@RequestBody CreateStadeDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StadeResponseDTO> update(
            @PathVariable Long id,
            @RequestBody UpdateStadeDTO dto) {

        return ResponseEntity.ok(service.update(id, dto));
    }


    @GetMapping("/{id}")
    public ResponseEntity<StadeResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }


    @GetMapping
    public ResponseEntity<List<StadeResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
