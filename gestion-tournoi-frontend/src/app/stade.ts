export interface StadeResponse {
  id: number;
  nom: string;
  ville: string;
  heureOuverture: string; // format "HH:mm:ss"
  heureFermeture: string;
  matchIds: number[];
}

export interface CreateStade {
  nom: string;
  ville: string;
  heureOuverture: string;
  heureFermeture: string;
}

export interface UpdateStade {
  id?: number;
  nom?: string;
  ville?: string;
  heureOuverture?: string;
  heureFermeture?: string;
}