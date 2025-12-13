import { Component} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-signUp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signUp.component.html',
  styleUrl: './signUp.component.css'
})
export class SignUpComponent {

  signUpForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    login: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  })

  constructor(private router: Router) {
  }

  navigateToHomePage() {
    this.router.navigate(['home']);
  }

  navigateToSignInPage() {
    this.router.navigate(['signIn']);
  }
}
