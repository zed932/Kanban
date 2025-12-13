import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signIn.component.html',
  styleUrl: './signIn.component.css'
})
export class SignInComponent {

  signInForm = new FormGroup({
    login: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  authService: Auth = inject(Auth);

  constructor(private router: Router) {
  }

  navigateToHomePage() {
    this.router.navigate(['home']);
  }

  navigateToSignUpPage(){
    this.router.navigate(['signUp']);
  }

  signInApplication(){
    this.authService.signInApplication(
      this.signInForm.value.login ?? "",
      this.signInForm.value.password ?? ""
    )
  }
}
