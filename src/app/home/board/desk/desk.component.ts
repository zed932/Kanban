import {Component, Input} from "@angular/core";
import {TaskComponent} from './task/task.component';
import {Task} from "./task/task"
@Component({
  selector: "desk",
  templateUrl: "./desk.component.html",
  styleUrls: ['./desk.component.css'],
  standalone: true,
  imports: [TaskComponent],

})
export class deskComponent {
  @Input() name: string = "";
  @Input() tasksList: Task[] = [];

}
