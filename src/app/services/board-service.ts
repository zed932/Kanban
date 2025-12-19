import { Injectable, signal } from '@angular/core';
import { Desk } from "../home/board/desk/desk"
import { Task } from "../home/board/desk/task/task"
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private baseUrl = 'http://localhost:3000/api';

  private desksSignal = signal<Desk[]>([]);
  readonly desks = this.desksSignal.asReadonly();

  constructor(private http: HttpClient) { }

  getDesksList(): Observable<Desk[]> {
    return this.http.get<Desk[]>(`${this.baseUrl}/desks`).pipe(
      map((desksList: Desk[]) => {
        this.desksSignal.set(desksList);
        return desksList;
      })
    );
  }

  // Методы для досок
  createDesk(name: string): Observable<Desk> {
    return this.http.post<Desk>(`${this.baseUrl}/desks`, { name }).pipe(
      tap(newDesk => {
        this.desksSignal.update(desks => [...desks, newDesk]);
      })
    );
  }

  updateDesk(id: number, updates: Partial<Desk>): Observable<Desk> {
    return this.http.put<Desk>(`${this.baseUrl}/desks/${id}`, updates).pipe(
      tap(updatedDesk => {
        this.desksSignal.update(desks =>
          desks.map(desk => desk.id === id ? updatedDesk : desk)
        );
      })
    );
  }

  deleteDesk(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/desks/${id}`).pipe(
      tap(() => {
        this.desksSignal.update(desks => desks.filter(desk => desk.id !== id));
      })
    );
  }

  // Методы для задач
  addTask(deskId: number, task: { name: string; description: string }): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/desk/${deskId}`, task);
  }

  updateTask(deskId: number, taskId: number, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/desk/${deskId}/${taskId}`, updates);
  }

  deleteTask(deskId: number, taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/desk/${deskId}/${taskId}`);
  }

  // Вспомогательный метод для обновления задач локально
  updateTaskLocally(deskId: number, updatedTask: Task): void {
    this.desksSignal.update(desks =>
      desks.map(desk => {
        if (desk.id === deskId) {
          return {
            ...desk,
            tasksList: desk.tasksList.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            )
          };
        }
        return desk;
      })
    );
  }

  // Метод для обновления списка задач локально после удаления
  removeTaskLocally(deskId: number, taskId: number): void {
    this.desksSignal.update(desks =>
      desks.map(desk => {
        if (desk.id === deskId) {
          return {
            ...desk,
            tasksList: desk.tasksList.filter(task => task.id !== taskId)
          };
        }
        return desk;
      })
    );
  }
}
