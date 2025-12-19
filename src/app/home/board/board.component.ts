import { Component, inject, OnInit } from "@angular/core";
import { deskComponent } from './desk/desk.component';
import { Desk } from './desk/desk';
import { BoardService } from '../../services/board-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
  standalone: true,
  imports: [deskComponent, CommonModule, FormsModule],
})
export class BoardComponent implements OnInit {
  boardService: BoardService = inject(BoardService);
  isCreatingDesk = false;
  newDeskName = '';

  constructor() {}

  ngOnInit() {
    this.loadDesks();
  }

  loadDesks() {
    this.boardService.getDesksList().subscribe();
  }

  get desksList() {
    return this.boardService.desks();
  }

  startCreatingDesk() {
    this.isCreatingDesk = true;
    this.newDeskName = '';
  }

  createDesk() {
    if (this.newDeskName.trim()) {
      this.boardService.createDesk(this.newDeskName.trim()).subscribe({
        next: () => {
          this.isCreatingDesk = false;
          this.newDeskName = '';
        },
        error: (error) => {
          console.error('Error creating desk:', error);
        }
      });
    }
  }

  cancelCreatingDesk() {
    this.isCreatingDesk = false;
    this.newDeskName = '';
  }
}
