import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: "./home.component.html",
  styleUrls: ['./home.component.css']
  }
)

export class HomeComponent {
  userName:string ="Пользователь";

  constructor(private router: Router) {}


  logout():void{}

  navigateToBoard(){
    this.router.navigate(['home/board']);
  }

  navigateToProfile(){
    this.router.navigate(['home/profile']);
  }
}
