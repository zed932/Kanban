import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  authService = inject(Auth);

  constructor(private router: Router) {}

  get userName() {
    return this.authService.user()?.login || 'Пользователь';
  }

  get userEmail() {
    return this.authService.user()?.email || '';
  }

  logout(): void {
    // Подтверждение выхода
    if (confirm('Вы уверены, что хотите выйти?')) {
      this.authService.logout();
      this.router.navigate(['signIn']);
    }
  }

  navigateToBoard() {
    this.router.navigate(['home/board']);
  }

  navigateToProfile() {
    this.router.navigate(['home/profile']);
  }

  // Метод для проверки активной страницы
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
