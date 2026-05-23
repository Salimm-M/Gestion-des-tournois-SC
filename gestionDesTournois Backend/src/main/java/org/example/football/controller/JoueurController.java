package org.example.football.controller;



import lombok.RequiredArgsConstructor;
import org.example.football.dto.equipe.CreateJoueurDTO;
import org.example.football.dto.equipe.ReponseJoueur;
import org.example.football.dto.equipe.ResultatImportJoueur;
import org.example.football.service.JoueurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JoueurController {

    private final JoueurService joueurService;


    @PostMapping("/upload/{idEquipe}")
    public ResponseEntity<ResultatImportJoueur> uploadJoueurs(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long idEquipe
    ) {

        if (file.isEmpty()) {

            ResultatImportJoueur resultat =
                    new ResultatImportJoueur();

            resultat.getErreurs().add(
                    "Fichier vide"
            );

            return ResponseEntity.badRequest()
                    .body(resultat);
        }

        try {

            ResultatImportJoueur resultat =
                    joueurService.lireJoueursDepuisCSV(
                            file,
                            idEquipe
                    );

            return ResponseEntity.ok(resultat);

        } catch (RuntimeException e) {

            ResultatImportJoueur resultat =
                    new ResultatImportJoueur();

            resultat.getErreurs().add(
                    e.getMessage()
            );

            return ResponseEntity.badRequest()
                    .body(resultat);
        }
    }


    @GetMapping("/joueurs")
    public ResponseEntity<List<ReponseJoueur>> getAll() {
        return ResponseEntity.ok(joueurService.getAll());
    }

    @GetMapping("/joueurs/{id}")
    public ResponseEntity<ReponseJoueur> getById(@PathVariable Long id) {

        return ResponseEntity.ok(joueurService.getById(id));
    }

    @PostMapping("/joueurs")
    public ResponseEntity<ReponseJoueur> create(@RequestBody CreateJoueurDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(joueurService.create(dto));
    }

    @PutMapping("/joueurs/{id}")
    public ResponseEntity<ReponseJoueur> update(@PathVariable Long id,
                                                @RequestBody CreateJoueurDTO dto) {
        return ResponseEntity.ok(joueurService.update(id, dto));
    }

    @DeleteMapping("/joueurs/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        joueurService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/equipes/{equipeId}/joueurs")
    public ResponseEntity<List<ReponseJoueur>> getByEquipe(@PathVariable Long equipeId) {

        return ResponseEntity.ok(joueurService.getByEquipe(equipeId));
    }
    @GetMapping("/responsable/{equipeId}/joueurs")
    public ResponseEntity<List<ReponseJoueur>> getByRespEquipe(@PathVariable Long equipeId) {

        return ResponseEntity.ok(joueurService.getByEquipe(equipeId));
    }
}
