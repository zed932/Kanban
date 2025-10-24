import { Component} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
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
