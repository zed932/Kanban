import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: "./home.component.html",
  styleUrls: ['./home.component.css']
  }
)

export class HomeComponent {
  userName:string ="";
  newTask: any = null;
  tasks: any = [];

  addTask(){}
  getCompletedTasks():any{}
  toggleTask(task:any){}
  deleteTask(task:any){}
  logout():void{}
}
