export interface Joueur {
  id: number;
  nom: string;
  prenom: string;
  dateNaiss: string; 
  poste: string;
  idEquipe: number | null;
}


export interface ResultatImportJoueur {

  joueurs: Joueur[];

  erreurs: string[];

}