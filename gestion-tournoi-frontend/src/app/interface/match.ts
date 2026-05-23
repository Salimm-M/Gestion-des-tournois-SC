export type StatutMatch = 'PLANIFIE' | 'EN_COURS' | 'TERMINE' | 'REPORTE' | 'ANNULE';

export interface Equipe {
  id: number;
  nom: string;
  logo?: string;
}

export interface Match {
  id: number;
  journee: number;
  dateMatch: string;      
  statut: StatutMatch;
  heureDebut: string;      
  equipeDomicile: Equipe;
  equipeExterieur: Equipe;
  scoreDomicile: number;
  scoreExterieur: number;
}

export interface SlotDisponible {
  heure: string;         
  disponible: boolean;
}
export interface MatchPlanifie {
  idMatch: number;
  
  dateMatch: string;      

  heureDebut: string;      

 
  stadeId: number;
}