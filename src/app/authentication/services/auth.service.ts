import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private readonly apiUrl = 'http://localhost:3000';

  private authenticatedUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {}

  login(username: string, password: string): Observable<User[]> {
    return this.http
      .get<
        User[]
      >(`${this.apiUrl}/users?username=${username}&password=${password}`)
      .pipe(
        tap(users => {
          const user = users[0];
          this.setAuthenticatedUser(user);
          this.saveToken(user.token);
        })
      );
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.setAuthenticatedUser(null);
  }

  setAuthenticatedUser(user: User | null): void {
    this.authenticatedUserSubject.next(user);
  }

  getAuthenticatedUser(): Observable<User | null> {
    return this.authenticatedUserSubject.asObservable();
  }

  saveToken(token: string): void {
    this.cookieService.set('auth_token', token);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }
}
