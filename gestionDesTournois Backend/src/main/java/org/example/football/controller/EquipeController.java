package org.example.football.controller;


import lombok.RequiredArgsConstructor;
import org.example.football.dto.equipe.CreateEquipe;
import org.example.football.dto.equipe.ReponseEquipe;
import org.example.football.entites.Equipe;
import org.example.football.service.EquipeService;
import org.example.football.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/equipe")
@RequiredArgsConstructor
public class EquipeController {
    private final EquipeService equipeService;
    @PostMapping("/create")
    public ResponseEntity<ReponseEquipe> equipe(
            @RequestParam String nomEcole,
            @RequestParam String abbreviation,
            @RequestParam String nom,
            @RequestParam String pays,
            @RequestParam Long idResponsable,
            @RequestParam(required = false) MultipartFile logo) throws IOException {

        CreateEquipe dto = new CreateEquipe();
        dto.setAbbreviation(abbreviation);
        dto.setNom(nom);
        dto.setPays(pays);
        dto.setNomEcole(nomEcole);
        dto.setIdResponsable(idResponsable);
        System.out.println("iiiiiiiiiiiiiiiiidddddddddddddddd"+idResponsable);

        if (logo != null && !logo.isEmpty()) {
            dto.setLogo(logo.getBytes()); }

        return ResponseEntity.ok(equipeService.createEquipe(dto));
    }
    @GetMapping("/responsable/{id}")
    public ResponseEntity<ReponseEquipe> getEquipeByResp(@PathVariable Long id) {
        return ResponseEntity.ok(this.equipeService.getEquipeByResponsableId(id));
    }
    @GetMapping
    public ResponseEntity<List<ReponseEquipe>> getAll(){
        return ResponseEntity.ok(this.equipeService.getAll());

    }
}
