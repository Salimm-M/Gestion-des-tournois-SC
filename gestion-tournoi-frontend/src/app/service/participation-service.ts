import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TournoiDTO } from '../interface/tournoi';
import { ClassementDTO, ParticipationDTO } from '../interface/participation-dto';

@Injectable({ providedIn: 'root' })
export class ParticipationService {
  private api = 'http://localhost:8091/api/participations';

  constructor(private http: HttpClient) {}

  getDisponibles(equipeId: number): Observable<TournoiDTO[]> {
    return this.http.get<TournoiDTO[]>(`${this.api}/disponibles/${equipeId}`);
  }

  getRejoint(equipeId: number): Observable<TournoiDTO[]> {
    return this.http.get<TournoiDTO[]>(`${this.api}/rejoint/${equipeId}`);
  }
  getMesParticipations(equipeId: number): Observable<ParticipationDTO[]> {
  return this.http.get<ParticipationDTO[]>(`${this.api}/equipe/${equipeId}`);
}

  rejoindre(equipeId: number, tournoiId: number): Observable<ParticipationDTO> {
    return this.http.post<ParticipationDTO>(`${this.api}/rejoindre`, { equipeId, tournoiId });
  }

  quitter(participationId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${participationId}`);
  }
  getClassement(tournoiId: number): Observable<ClassementDTO[]> {
    return this.http.get<ClassementDTO[]>(`${this.api}/${tournoiId}/classement`);
  }
}