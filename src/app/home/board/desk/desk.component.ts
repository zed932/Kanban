import {Component} from "@angular/core";

class Task {
  name: string;
  description: string;
  isCompleted: boolean;

  constructor(name:string = "Unknown", description: string = "Unset", isCompleted: boolean = false) {
    this.name = name;
    this.description = description;
    this.isCompleted = isCompleted;
  }
}


@Component({
  selector: "desk",
  templateUrl: "./desk.component.html",
  styleUrls: ['./desk.component.css'],
  standalone: true

})
export class deskComponent {
  name: string = "";
  tasks: Task[] = [];


}
