import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEquipe } from '../interface/equipe/create-equipe';
import { ReponseEquipe } from '../interface/equipe/reponse-equipe';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  private apiUrl = 'http://localhost:8091/equipe';

  constructor(private http: HttpClient) {}




  createEquipe(formData: FormData): Observable<ReponseEquipe> {




   

    return this.http.post<ReponseEquipe>(`${this.apiUrl}/create`, formData);
  }


  getAll(): Observable<ReponseEquipe[]> {
    return this.http.get<ReponseEquipe[]>(this.apiUrl);
  }


  getById(id: number): Observable<ReponseEquipe> {
    return this.http.get<ReponseEquipe>(`${this.apiUrl}/${id}`);
  }
  getByRespId(id?: number): Observable<ReponseEquipe> {
    return this.http.get<ReponseEquipe>(`${this.apiUrl}/responsable/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  update(id: number, data: CreateEquipe, logoFile?: File): Observable<ReponseEquipe> {
    const formData = new FormData();

    formData.append('abbreviation', data.abbreviation);
    formData.append('nom', data.nom);
    formData.append('pays', data.pays);
    formData.append('idResponsable', data.idResponsable.toString());

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    return this.http.put<ReponseEquipe>(`${this.apiUrl}/${id}`, formData);
  }
  
}