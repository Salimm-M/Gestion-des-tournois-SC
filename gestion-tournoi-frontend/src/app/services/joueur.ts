import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Joueur, ResultatImportJoueur } from '../interface/joueur/joueur';
import { CreateJoueurDTO } from '../interface/joueur/create-joueur-dto';

@Injectable({
  providedIn: 'root'
})
export class JoueurService {

  private readonly apiUrl = 'http://localhost:8091/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Joueur[]> {
    return this.http.get<Joueur[]>(`${this.apiUrl}/joueurs`);
  }

  getById(id: number): Observable<Joueur> {
    return this.http.get<Joueur>(`${this.apiUrl}/joueurs/${id}`);
  }

  create(dto: CreateJoueurDTO): Observable<Joueur> {
    return this.http.post<Joueur>(`${this.apiUrl}/joueurs`, dto);
  }

  update(id: number, dto: CreateJoueurDTO): Observable<Joueur> {
    return this.http.put<Joueur>(`${this.apiUrl}/joueurs/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/joueurs/${id}`);
  }

  getByEquipe(equipeId: number): Observable<Joueur[]> {
   
    return this.http.get<Joueur[]>(`${this.apiUrl}/equipes/${equipeId}/joueurs`);
  }
uploadCSV(
  file: File,
  idEquipe: number
): Observable<ResultatImportJoueur> {

  const formData = new FormData();

  formData.append('file', file);

  return this.http.post<ResultatImportJoueur>(
    `${this.apiUrl}/upload/${idEquipe}`,
    formData
  );
}
}