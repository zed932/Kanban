import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signUp.component.html',
  styleUrl: './signUp.component.css'
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    login: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl("", [Validators.required]) // Добавил подтверждение пароля
  });

  authService: Auth = inject(Auth);
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  navigateToHomePage() {
    // Просто вызываем onSubmit
    this.onSubmit();
  }

  navigateToSignInPage() {
    this.router.navigate(['signIn']);
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { email, login, password, confirmPassword } = this.signUpForm.value;

    // Базовая проверка совпадения паролей
    if (password !== confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signUpApplication({
      email: email ?? '',
      login: login ?? '',
      password: password ?? ''
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Регистрация успешна! Теперь вы можете войти.';
        // Очищаем форму
        this.signUpForm.reset();
        // Через 2 секунды перенаправляем на вход
        setTimeout(() => {
          this.router.navigate(['signIn']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'Пользователь с таким email или логином уже существует';
        } else {
          this.errorMessage = 'Произошла ошибка при регистрации';
        }
      }
    });
  }
}
