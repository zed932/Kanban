import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { deskComponent } from './desk/desk.component';
import { Desk } from './desk/desk';
import { BoardService } from '../../services/board-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { Auth } from '../../services/auth'; // Добавляем импорт Auth

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
  standalone: true,
  imports: [deskComponent, CommonModule, FormsModule, ProgressBarComponent],
})
export class BoardComponent implements OnInit {
  boardService: BoardService = inject(BoardService);
  private authService = inject(Auth); // Добавляем Auth сервис
  private cdr = inject(ChangeDetectorRef);

  isCreatingDesk = false;
  newDeskName = '';

  // Получаем статистику из сервиса
  get taskStats() {
    return this.boardService.taskStats();
  }

  constructor() {
    console.log('BoardComponent constructor');
    console.log('Auth state:', this.authService.isAuthenticated());
    console.log('User:', this.authService.user());
  }

  ngOnInit() {
    console.log('BoardComponent ngOnInit');
    this.loadDesks();
  }

  loadDesks() {
    console.log('Loading desks...');
    console.log('Auth token:', this.authService.getToken());

    this.boardService.getDesksList().subscribe({
      next: (desks) => {
        console.log('Desks loaded successfully:', desks);
      },
      error: (error) => {
        console.error('Failed to load desks:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      },
      complete: () => {
        console.log('Desks loading completed');
      }
    });
  }

  get desksList() {
    const desks = this.boardService.desks();
    console.log('Current desks in signal:', desks);
    return desks;
  }

  startCreatingDesk() {
    console.log('Starting desk creation');
    this.isCreatingDesk = true;
    this.newDeskName = '';
  }

  createDesk() {
    if (this.newDeskName.trim()) {
      console.log('Creating desk:', this.newDeskName);

      this.boardService.createDesk(this.newDeskName.trim()).subscribe({
        next: (newDesk) => {
          console.log('Desk created successfully:', newDesk);
          this.isCreatingDesk = false;
          this.newDeskName = '';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to create desk:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
        }
      });
    }
  }

  cancelCreatingDesk() {
    this.isCreatingDesk = false;
    this.newDeskName = '';
  }
}
