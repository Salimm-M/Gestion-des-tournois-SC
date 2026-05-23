import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCreate } from '../interface/user/user-create';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8091/user';

  constructor(private http: HttpClient) {}

  createUser(user: UserCreate): Observable<UserCreate> {
    return this.http.post<UserCreate>(this.apiUrl+'/create', user);
  }
  getAllUsers(): Observable<UserCreate[]> {
    return this.http.get<UserCreate[]>(this.apiUrl);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateUser( user: UserCreate): Observable<UserCreate> {
    return this.http.patch<UserCreate>(`${this.apiUrl}`, user);
  }

}