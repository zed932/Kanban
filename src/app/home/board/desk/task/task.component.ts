import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Task } from "./task";
import { BoardService } from '../../../../services/board-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() deskId!: number;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<number>();

  boardService: BoardService = inject(BoardService);

  isEditing = false;
  editedTask = {
    name: '',
    description: ''
  };

  toggleComplete() {
    this.boardService.updateTask(this.deskId, this.task.id, {
      isCompleted: !this.task.isCompleted
    }).subscribe({
      next: (updatedTask: Task) => {
        this.taskUpdated.emit(updatedTask);
      },
      error: (error: any) => {
        console.error('Error updating task:', error);
      }
    });
  }

  startEditing() {
    this.isEditing = true;
    this.editedTask = {
      name: this.task.name,
      description: this.task.description
    };
  }

  saveEdit() {
    if (this.editedTask.name.trim()) {
      this.boardService.updateTask(this.deskId, this.task.id, {
        name: this.editedTask.name.trim(),
        description: this.editedTask.description.trim()
      }).subscribe({
        next: (updatedTask: Task) => {
          this.isEditing = false;
          this.taskUpdated.emit(updatedTask);
        },
        error: (error: any) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedTask = { name: '', description: '' };
  }

  deleteTask() {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      this.boardService.deleteTask(this.deskId, this.task.id).subscribe({
        next: () => {
          this.taskDeleted.emit(this.task.id);
        },
        error: (error: any) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }
}
