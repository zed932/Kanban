import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { deskComponent } from './desk/desk.component';
import { Desk } from './desk/desk';
import { BoardService } from '../../services/board-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
  standalone: true,
  imports: [deskComponent, CommonModule, FormsModule, ProgressBarComponent],
})
export class BoardComponent implements OnInit {
  boardService: BoardService = inject(BoardService);
  private cdr = inject(ChangeDetectorRef);

  isCreatingDesk = false;
  newDeskName = '';

  // Получаем статистику из сервиса
  get taskStats() {
    return this.boardService.taskStats();
  }

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
          // Принудительно запускаем обнаружение изменений
          this.cdr.detectChanges();
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
