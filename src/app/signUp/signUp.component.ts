import { Component} from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signUp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signUp.component.html',
  styleUrl: './signUp.component.css'
})
export class SignUpComponent {
  name: string ="";
  login: string ="";
  password: string ="";

  constructor(private router: Router) {
  }

  navigateToHomePage() {
    this.router.navigate(['home']);
  }

  navigateToSignInPage() {
    this.router.navigate(['signIn']);
  }
}
