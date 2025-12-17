import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ISignIn } from '../signIn/ISignIn';
import { ISignUp } from '../signUp/ISignUp';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  // 1. Сигнал для состояния авторизации
  private isAuthenticatedSignal = signal<boolean>(false);
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // 2. Сигнал для данных пользователя
  private userSignal = signal<{login: string, email: string} | null>(null);
  readonly user = this.userSignal.asReadonly();

  constructor() {
    // 3. Проверяем localStorage при инициализации
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isAuthenticatedSignal.set(true);
      // Можно загрузить данные пользователя
    }
  }

  signInApplication(login: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { login, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isAuthenticatedSignal.set(true);
          this.userSignal.set({ login: response.login, email: response.email });
        }
      })
    );
  }

  // 4. Добавим метод для регистрации
  signUpApplication(userData: ISignUp): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, userData);
  }

  // 5. Метод для выхода
  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSignal.set(false);
    this.userSignal.set(null);
  }
}
