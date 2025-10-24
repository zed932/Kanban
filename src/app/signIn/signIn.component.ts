import { Component} from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signIn.component.html',
  styleUrl: './signIn.component.css'
})
export class SignInComponent {
  name: string ="";
  login: string ="";
  password: string ="";

  constructor(private router: Router) {
  }

  navigateToHomePage() {
    this.router.navigate(['home']);
  }
}
