import { Injectable, signal, computed, effect } from '@angular/core';
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

  // Вычисляемая статистика - автоматически пересчитывается при изменении desksSignal
  readonly taskStats = computed(() => {
    const desks = this.desksSignal();

    console.log('Пересчет статистики, количество досок:', desks.length);

    if (desks.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
        byDesk: []
      };
    }

    let totalTasks = 0;
    let completedTasks = 0;
    const byDesk = [];

    for (const desk of desks) {
      const deskTotal = desk.tasksList.length;
      const deskCompleted = desk.tasksList.filter(task => task.isCompleted).length;

      totalTasks += deskTotal;
      completedTasks += deskCompleted;

      byDesk.push({
        deskId: desk.id,
        deskName: desk.name,
        total: deskTotal,
        completed: deskCompleted,
        percentage: deskTotal > 0 ? Math.round((deskCompleted / deskTotal) * 100) : 0
      });

      console.log(`Доска ${desk.name}: ${deskCompleted}/${deskTotal}`);
    }

    const completionPercentage = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    console.log(`Общая статистика: ${completedTasks}/${totalTasks} (${completionPercentage}%)`);

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      byDesk
    };
  });

  constructor(private http: HttpClient) {
    // Для отладки: логируем изменения статистики
    effect(() => {
      const stats = this.taskStats();
      console.log('Статистика обновлена:', stats);
    });
  }

  getDesksList(): Observable<Desk[]> {
    return this.http.get<Desk[]>(`${this.baseUrl}/desks`).pipe(
      map((desksList: Desk[]) => {
        console.log('Получены доски с сервера:', desksList);
        this.desksSignal.set(desksList);
        return desksList;
      })
    );
  }

  // Методы для досок
  createDesk(name: string): Observable<Desk> {
    return this.http.post<Desk>(`${this.baseUrl}/desks`, { name }).pipe(
      tap(newDesk => {
        console.log('Доска создана:', newDesk);
        this.desksSignal.update(desks => [...desks, newDesk]);
      })
    );
  }

  updateDesk(id: number, updates: Partial<Desk>): Observable<Desk> {
    return this.http.put<Desk>(`${this.baseUrl}/desks/${id}`, updates).pipe(
      tap(updatedDesk => {
        console.log('Доска обновлена:', updatedDesk);
        this.desksSignal.update(desks =>
          desks.map(desk => desk.id === id ? updatedDesk : desk)
        );
      })
    );
  }

  deleteDesk(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/desks/${id}`).pipe(
      tap(() => {
        console.log('Доска удалена:', id);
        this.desksSignal.update(desks => desks.filter(desk => desk.id !== id));
      })
    );
  }

  // Методы для задач
  addTask(deskId: number, task: { name: string; description: string }): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks/desk/${deskId}`, task).pipe(
      tap(newTask => {
        console.log('Задача добавлена:', newTask);
        this.updateDeskWithNewTask(deskId, newTask);
      })
    );
  }

  updateTask(deskId: number, taskId: number, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/desk/${deskId}/${taskId}`, updates).pipe(
      tap(updatedTask => {
        console.log('Задача обновлена:', updatedTask);
        this.updateDeskWithUpdatedTask(deskId, updatedTask);
      })
    );
  }

  deleteTask(deskId: number, taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/desk/${deskId}/${taskId}`).pipe(
      tap(() => {
        console.log('Задача удалена:', taskId);
        this.updateDeskWithRemovedTask(deskId, taskId);
      })
    );
  }

  // Вспомогательные методы для обновления состояния
  private updateDeskWithNewTask(deskId: number, newTask: Task): void {
    this.desksSignal.update(desks =>
      desks.map(desk => {
        if (desk.id === deskId) {
          return {
            ...desk,
            tasksList: [...desk.tasksList, newTask]
          };
        }
        return desk;
      })
    );
  }

  private updateDeskWithUpdatedTask(deskId: number, updatedTask: Task): void {
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

  private updateDeskWithRemovedTask(deskId: number, taskId: number): void {
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
