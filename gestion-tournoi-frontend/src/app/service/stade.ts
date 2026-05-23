import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateStade, StadeResponse, UpdateStade } from '../stade';


@Injectable({
  providedIn: 'root'
})
export class StadeService {

  private apiUrl = 'http://localhost:8091/api/stades';

  constructor(private http: HttpClient) {}


  getAll(): Observable<StadeResponse[]> {
    return this.http.get<StadeResponse[]>(this.apiUrl);
  }


  getById(id: number): Observable<StadeResponse> {
    return this.http.get<StadeResponse>(`${this.apiUrl}/${id}`);
  }

 
  create(stade: CreateStade): Observable<StadeResponse> {
    return this.http.post<StadeResponse>(this.apiUrl, stade);
  }


  update(id: number, stade: UpdateStade): Observable<StadeResponse> {
    return this.http.put<StadeResponse>(`${this.apiUrl}/${id}`, stade);
  }

  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}