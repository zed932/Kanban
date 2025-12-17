import {Component, inject, OnInit} from "@angular/core";
import {deskComponent} from './desk/desk.component';
import {Desk} from './desk/desk';
import {BoardService} from '../../services/board-service';


@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
  standalone: true,
  imports: [deskComponent],
})

export class BoardComponent {
  desksList: Desk[] = [];

  boardService : BoardService = inject(BoardService);

  constructor() {
  }

  ngOnInit() {
    this.boardService.getDesksList().subscribe({next: data => {this.desksList = data}});
  }

}
