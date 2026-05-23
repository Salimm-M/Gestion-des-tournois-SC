export interface ParticipationDTO {
  id: number;
  points: number;
  nbVictoires: number;
  nbNuls: number;
  nbDefaites: number;
  butsMarques: number;
  butsEncaisses: number;
  differenceButs: number;
  equipeId: number;
  equipeNom: string;
  tournoiId: number;
  tournoiNom: string;
  tournoiType: string;
  tournoiStatut: string;
  tournoiDateDebut: string;
  tournoiDateFin: string;
  tournoiEstLance: boolean;
}
export interface ClassementDTO {
  id: number;
  equipeNom: string;
  equipeId: number;
  points: number;
  nbVictoires: number;
  nbNuls: number;
  nbDefaites: number;
  butsMarques: number;
  butsEncaisses: number;
  differenceButs: number;
}