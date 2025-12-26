import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./home.component.html",
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  authService = inject(Auth);
  private router = inject(Router);

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
      this.router.navigate(['/signIn']);
    }
  }

  // Метод для проверки активной страницы (если нужен для логики)
  isActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
