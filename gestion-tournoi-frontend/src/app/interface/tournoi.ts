// tournoi-dto.ts
export interface TournoiDTO {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  nbEquipes: number;
  nbParticipations: number;
  typeTournoi: string;
  statut: string;
  ouvert: boolean;
  estLance: boolean;
  nbJoueurSurTerrain:number;
}


export interface TournoiCreateDTO {
  nom: string;
  dateDebut: string;
   nbJoueurSurTerrain:number;
  dateFin: string;
  nbEquipes: number;
  typeTournoi: string;
}