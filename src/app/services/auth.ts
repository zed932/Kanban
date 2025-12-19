import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ISignIn } from '../signIn/ISignIn';
import { ISignUp } from '../signUp/ISignUp';

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    login: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  // Сигналы
  private isAuthenticatedSignal = signal<boolean>(false);
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  private userSignal = signal<{id: number, login: string, email: string} | null>(null);
  readonly user = this.userSignal.asReadonly();

  constructor() {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Можно добавить запрос на проверку токена
      this.isAuthenticatedSignal.set(true);
    }
  }

  signInApplication(login: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signin`, { login, password }).pipe(
      tap((response) => {
        localStorage.setItem('auth_token', response.token);
        this.isAuthenticatedSignal.set(true);
        this.userSignal.set(response.user);
      })
    );
  }

  signUpApplication(userData: ISignUp): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signup`, userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSignal.set(false);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
