import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EquipeService {

  private api = 'http://localhost:8000/api/equipes';

  constructor(private http: HttpClient) {}

  getMyTeams() {
    return this.http.get<any[]>(`${this.api}/my`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}