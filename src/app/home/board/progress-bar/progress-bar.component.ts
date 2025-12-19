import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <h3>Прогресс выполнения задач</h3>
        <div class="stats">
          <span class="completed">{{ completedTasks }} / {{ totalTasks }}</span>
          <span class="percentage">{{ completionPercentage }}%</span>
        </div>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          [style.width.%]="completionPercentage"
          [class.complete]="completionPercentage === 100"
        >
          <span class="progress-text">{{ completionPercentage }}%</span>
        </div>
      </div>

      <div class="progress-labels">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      <div class="desk-stats" *ngIf="deskStats && deskStats.length > 0">
        <h4>По доскам:</h4>
        <div class="desk-list">
          <div *ngFor="let desk of deskStats" class="desk-stat-item">
            <div class="desk-info">
              <span class="desk-name">{{ desk.deskName }}</span>
              <span class="desk-count">{{ desk.completed }}/{{ desk.total }}</span>
            </div>
            <div class="desk-progress">
              <div
                class="desk-progress-fill"
                [style.width.%]="desk.percentage"
              >
                <span class="desk-progress-text" *ngIf="desk.percentage > 20">
                  {{ desk.percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .progress-container:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .progress-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }

    .stats {
      display: flex;
      gap: 15px;
      font-weight: 600;
    }

    .completed {
      color: #666;
    }

    .percentage {
      color: #3498db;
      font-size: 18px;
    }

    .progress-bar {
      height: 24px;
      background-color: #f0f0f0;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 5px;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      border-radius: 12px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 10px;
      min-width: 50px;
    }

    .progress-fill.complete {
      background: linear-gradient(90deg, #2ecc71, #27ae60);
    }

    .progress-text {
      color: white;
      font-weight: bold;
      font-size: 12px;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      color: #888;
      font-size: 12px;
      margin-bottom: 20px;
    }

    .desk-stats h4 {
      margin: 0 0 10px 0;
      color: #555;
      font-size: 16px;
    }

    .desk-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .desk-stat-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .desk-info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .desk-name {
      color: #444;
      font-weight: 500;
    }

    .desk-count {
      color: #666;
    }

    .desk-progress {
      height: 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }

    .desk-progress-fill {
      height: 100%;
      background-color: #3498db;
      border-radius: 4px;
      transition: width 0.5s ease;
      position: relative;
    }

    .desk-progress-text {
      position: absolute;
      right: 5px;
      top: -15px;
      font-size: 10px;
      color: #3498db;
      font-weight: bold;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
      .progress-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .stats {
        align-self: flex-end;
      }

      .progress-bar {
        height: 20px;
      }

      .progress-text {
        font-size: 10px;
      }
    }
  `]
})
export class ProgressBarComponent implements OnChanges {
  @Input() totalTasks: number = 0;
  @Input() completedTasks: number = 0;
  @Input() deskStats?: Array<{
    deskId: number;
    deskName: string;
    total: number;
    completed: number;
    percentage: number;
  }> = [];

  completionPercentage: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.totalTasks > 0) {
      const newPercentage = Math.round((this.completedTasks / this.totalTasks) * 100);
      console.log(`ProgressBar: ${this.completedTasks}/${this.totalTasks} = ${newPercentage}%`);
      this.completionPercentage = newPercentage;
    } else {
      this.completionPercentage = 0;
    }
  }
}
