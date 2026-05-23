export interface CreateJoueurDTO {
  nom: string;
  prenom: string;
  dateNaiss: string;
  poste: string;
  idEquipe: number | null;
}