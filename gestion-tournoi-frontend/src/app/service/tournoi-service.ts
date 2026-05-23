import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TournoiDTO } from '../interface/tournoi';
import { TournoiCreateDTO } from '../interface/tournoi';

@Injectable({ providedIn: 'root' })
export class TournoiService {
  private apiUrl = 'http://localhost:8091/api/tournois';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TournoiDTO[]> {
    return this.http.get<TournoiDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<TournoiDTO> {
    return this.http.get<TournoiDTO>(`${this.apiUrl}/${id}`);
  }

  create(dto: TournoiCreateDTO): Observable<TournoiDTO> {
    return this.http.post<TournoiDTO>(this.apiUrl, dto);
  }

  update(id: number, dto: TournoiDTO): Observable<TournoiDTO> {
    return this.http.put<TournoiDTO>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  lancerTournoi(id: number): Observable<TournoiDTO> {
    return this.http.patch<TournoiDTO>(`${this.apiUrl}/${id}/lancer`, {});
  }

  fermerInscriptions(id: number): Observable<TournoiDTO> {
    return this.http.patch<TournoiDTO>(`${this.apiUrl}/${id}/fermer-inscriptions`, {});
  }
}