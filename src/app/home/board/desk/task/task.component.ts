import {Component, Input} from '@angular/core';
import {Task} from "./task"

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
})

export class TaskComponent {
  @Input() task!:Task;


}
