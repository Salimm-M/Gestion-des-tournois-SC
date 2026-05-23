import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:8091/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }
    saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
    getMe() {
    return this.http.get(`${this.api}/me`);
  }
   saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}