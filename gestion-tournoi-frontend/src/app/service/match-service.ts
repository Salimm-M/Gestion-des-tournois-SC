import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, MatchPlanifie } from '../interface/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private readonly base = 'http://localhost:8091/api/matches';

  constructor(private http: HttpClient) {}

  genererMatchs(tournoiId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/generate/${tournoiId}`, {});
  }

  
  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.base);
  }
  getMatchByEquipeAndTournoi(
  tournoiId: number,
  equipeId: number
): Observable<Match[]> {

  return this.http.get<Match[]>(
    `${this.base}/tournoi/${tournoiId}/equipe/${equipeId}`
  );
}
  getMatchesByTournoi(tournoiId: number): Observable<Match[]> {
    return this.http.get<Match[]>(
      `${this.base}/tournoi/${tournoiId}`
    );
  }
 
  getAvailableSlots(stadeId: number, date: string): Observable<string[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<string[]>(`${this.base}/stade/${stadeId}/slots`, { params });
  }
  planifierMatch(matchPlanifie: MatchPlanifie): Observable<void> {
    return this.http.post<void>(`${this.base}/planifier`, matchPlanifie);
  }
}