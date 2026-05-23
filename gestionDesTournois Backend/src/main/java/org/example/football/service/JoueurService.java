package org.example.football.service;

import lombok.AllArgsConstructor;

import org.example.football.dto.equipe.CreateJoueurDTO;
import org.example.football.dto.equipe.ReponseJoueur;
import org.example.football.dto.equipe.ResultatImportJoueur;
import org.example.football.entites.Equipe;
import org.example.football.entites.Joueur;
import org.example.football.mapper.JouerMapper;
import org.example.football.repository.EquipeRepository;
import org.example.football.repository.JoueurRepository;
import org.example.football.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
@Service
@AllArgsConstructor
public class JoueurService {
    private final JoueurRepository joueurRepository;
    private final JouerMapper joueurMapper;
    private final UserRepository userRepository;
    private final EquipeRepository equipeRepository;

    public List<ReponseJoueur> findMesJoueurs(Long reponsableId) {

        this.userRepository.findById(reponsableId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                         "responsable inexistant"
                ));
        System.out.println("Joueur findMesJoueurs");

 return this.joueurRepository.findByEquipe_Responsable_Id(reponsableId).stream().map(e->this.joueurMapper.toResponse(e)).toList();
    }
    public List<ReponseJoueur> getAll() {
        return joueurRepository.findAll()
                .stream()
                .map(joueurMapper::toResponse)
                .toList();
    }

    public ReponseJoueur getById(Long id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé : " + id));
        return joueurMapper.toResponse(joueur);
    }

    public ReponseJoueur create(CreateJoueurDTO dto) {
        Joueur joueur = joueurMapper.toEntity(dto);

        if (dto.getIdEquipe() != null) {
            Equipe equipe = equipeRepository.findById(dto.getIdEquipe())
                    .orElseThrow(() -> new RuntimeException("Équipe non trouvée : " + dto.getIdEquipe()));
            joueur.setEquipe(equipe);
        }

        return joueurMapper.toResponse(joueurRepository.save(joueur));
    }


    public ResultatImportJoueur lireJoueursDepuisCSV(
            MultipartFile file,
            Long idEquipe
    ) {

        ResultatImportJoueur resultat = new ResultatImportJoueur();

        List<String> postesValides = List.of(
                "Gardien",
                "Défenseur central",
                "Arriere gauche",
                "Arriere droit",
                "Milieu défensif",
                "Milieu central",
                "Milieu offensif",
                "Ailier gauche",
                "Ailier droit",
                "Avant-centre",
                "Attaquant"
        );

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String ligne;

            br.readLine();

            int numeroLigne = 1;

            Equipe equipe = equipeRepository.findById(idEquipe)
                    .orElseThrow(() ->
                            new RuntimeException("Equipe introuvable"));

            while ((ligne = br.readLine()) != null) {

                numeroLigne++;

                try {

                    if (ligne.trim().isEmpty()) {
                        continue;
                    }

                    String[] data = ligne.split(",");

                    if (data.length < 4) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : colonnes manquantes"
                        );

                        continue;
                    }

                    String nom = data[0].trim();
                    String prenom = data[1].trim();
                    String dateString = data[2].trim();
                    String poste = data[3].trim();


                    if (nom.isEmpty()) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : nom obligatoire"
                        );

                        continue;
                    }


                    if (prenom.isEmpty()) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : prénom obligatoire"
                        );

                        continue;
                    }


                    LocalDate dateNaiss;

                    try {

                        dateNaiss = LocalDate.parse(dateString);

                    } catch (Exception e) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : date invalide"
                        );

                        continue;
                    }


                    if (dateNaiss.isAfter(LocalDate.now())) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : date future invalide"
                        );

                        continue;
                    }


                    int age = Period.between(
                            dateNaiss,
                            LocalDate.now()
                    ).getYears();

                    if (age < 6 || age > 12) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : âge doit être entre 6 et 12 ans"
                        );

                        continue;
                    }

                    // CONTROLE POSTE
                    if (poste.isEmpty()) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : poste obligatoire"
                        );

                        continue;
                    }

                    if (!postesValides.contains(poste)) {

                        resultat.getErreurs().add(
                                "Ligne " + numeroLigne +
                                        " : poste invalide"
                        );

                        continue;
                    }

                    // CREATION JOUEUR
                    CreateJoueurDTO joueur = new CreateJoueurDTO();

                    joueur.setNom(nom);
                    joueur.setPrenom(prenom);
                    joueur.setDateNaiss(dateNaiss);
                    joueur.setPoste(poste);
                    joueur.setIdEquipe(idEquipe);

                    Joueur j = joueurMapper.toEntity(joueur);

                    j.setEquipe(equipe);

                    joueurRepository.save(j);

                    resultat.getJoueurs()
                            .add(joueurMapper.toResponse(j));

                } catch (Exception ex) {

                    resultat.getErreurs().add(
                            "Ligne " + numeroLigne +
                                    " : " + ex.getMessage()
                    );
                }
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Erreur lecture CSV : " + e.getMessage()
            );
        }

        return resultat;
    }
    public ReponseJoueur update(Long id, CreateJoueurDTO dto) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur non trouvé : " + id));

        joueur.setNom(dto.getNom());
        joueur.setPrenom(dto.getPrenom());
        joueur.setDateNaiss(dto.getDateNaiss());
        joueur.setPoste(dto.getPoste());

        if (dto.getIdEquipe() != null) {
            Equipe equipe = equipeRepository.findById(dto.getIdEquipe())
                    .orElseThrow(() -> new RuntimeException("Équipe non trouvée : " + dto.getIdEquipe()));
            joueur.setEquipe(equipe);
        } else {
            joueur.setEquipe(null);
        }

        return joueurMapper.toResponse(joueurRepository.save(joueur));
    }

    public void delete(Long id) {
        if (!joueurRepository.existsById(id)) {
            throw new RuntimeException("Joueur non trouvé : " + id);
        }
        joueurRepository.deleteById(id);
    }

    public List<ReponseJoueur> getByEquipe(Long equipeId) {
        return joueurRepository.findByEquipeId(equipeId)
                .stream()
                .map(joueurMapper::toResponse)
                .toList();

    }
}
