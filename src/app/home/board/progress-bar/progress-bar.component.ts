import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-header">
        <h3 class="progress-title">Прогресс выполнения задач</h3>
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

      @if (deskStats && deskStats.length > 0) {
        <div class="desk-stats">
          <h4 class="desk-stats-title">По доскам:</h4>
          <div class="desk-list">
            @for (desk of deskStats; track desk.deskId) {
              <div class="desk-stat-item">
                <div class="desk-info">
                  <span class="desk-name">{{ desk.deskName }}</span>
                  <span class="desk-count">{{ desk.completed }}/{{ desk.total }}</span>
                </div>
                <div class="desk-progress">
                  <div
                    class="desk-progress-fill"
                    [style.width.%]="desk.percentage"
                  >
                    @if (desk.percentage > 15) {
                      <span class="desk-progress-text">{{ desk.percentage }}%</span>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .progress-container {
      background-color: #ffffff;
      border-radius: clamp(8px, 1.2vw, 10px);
      padding: clamp(15px, 2.5vw, 20px);
      margin-bottom: clamp(20px, 3vw, 30px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-sizing: border-box;
    }

    .progress-container:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: clamp(10px, 1.5vw, 15px);
      margin-bottom: clamp(12px, 2vw, 15px);
    }

    .progress-title {
      margin: 0;
      color: #333;
      font-size: clamp(1rem, 1.8vw, 1.125rem);
      font-weight: 600;
      line-height: 1.3;
      flex: 1;
      min-width: 200px;
    }

    .stats {
      display: flex;
      gap: clamp(10px, 1.5vw, 15px);
      font-weight: 600;
      flex-wrap: wrap;
    }

    .completed {
      color: #666;
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
      padding: clamp(3px, 0.5vw, 4px) clamp(6px, 1vw, 8px);
      background-color: #f8f9fa;
      border-radius: 20px;
    }

    .percentage {
      color: #3498db;
      font-size: clamp(1rem, 1.8vw, 1.125rem);
      font-weight: 700;
      min-width: 50px;
      text-align: center;
    }

    .progress-bar {
      height: clamp(20px, 2.5vw, 24px);
      background-color: #f0f0f0;
      border-radius: clamp(10px, 1.5vw, 12px);
      overflow: hidden;
      margin-bottom: clamp(4px, 0.8vw, 5px);
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      border-radius: clamp(10px, 1.5vw, 12px);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: clamp(8px, 1.2vw, 10px);
      min-width: clamp(40px, 6vw, 50px);
    }

    .progress-fill.complete {
      background: linear-gradient(90deg, #2ecc71, #27ae60);
    }

    .progress-text {
      color: white;
      font-weight: bold;
      font-size: clamp(0.7rem, 1vw, 0.75rem);
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
      z-index: 1;
      position: relative;
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
      font-size: clamp(0.7rem, 1vw, 0.75rem);
      margin-bottom: clamp(15px, 2.5vw, 20px);
      padding: 0 clamp(2px, 0.5vw, 5px);
    }

    .desk-stats {
      margin-top: clamp(15px, 2.5vw, 20px);
      padding-top: clamp(12px, 2vw, 15px);
      border-top: 1px solid #f0f0f0;
    }

    .desk-stats-title {
      margin: 0 0 clamp(8px, 1.5vw, 10px) 0;
      color: #555;
      font-size: clamp(0.9rem, 1.5vw, 1rem);
      font-weight: 600;
    }

    .desk-list {
      display: flex;
      flex-direction: column;
      gap: clamp(8px, 1.5vw, 12px);
    }

    .desk-stat-item {
      display: flex;
      flex-direction: column;
      gap: clamp(4px, 0.8vw, 5px);
    }

    .desk-info {
      display: flex;
      justify-content: space-between;
      font-size: clamp(0.8rem, 1.2vw, 0.85rem);
      flex-wrap: wrap;
      gap: clamp(5px, 1vw, 8px);
    }

    .desk-name {
      color: #444;
      font-weight: 500;
      word-break: break-word;
      flex: 1;
      min-width: 120px;
    }

    .desk-count {
      color: #666;
      font-weight: 500;
      background-color: #f8f9fa;
      padding: clamp(2px, 0.5vw, 3px) clamp(6px, 1vw, 8px);
      border-radius: 12px;
      white-space: nowrap;
    }

    .desk-progress {
      height: clamp(6px, 1vw, 8px);
      background-color: #f0f0f0;
      border-radius: clamp(2px, 0.5vw, 4px);
      overflow: hidden;
      position: relative;
    }

    .desk-progress-fill {
      height: 100%;
      background-color: #3498db;
      border-radius: clamp(2px, 0.5vw, 4px);
      transition: width 0.5s ease;
      position: relative;
    }

    .desk-progress-text {
      position: absolute;
      right: clamp(3px, 0.5vw, 5px);
      top: -15px;
      font-size: clamp(0.6rem, 0.9vw, 0.7rem);
      color: #3498db;
      font-weight: bold;
      text-shadow: 0 1px 1px white;
      white-space: nowrap;
    }

    /* Медиа-запросы для тонкой настройки */
    @media (max-width: 768px) {
      .progress-header {
        flex-direction: column;
        align-items: stretch;
      }

      .progress-title {
        text-align: center;
        margin-bottom: clamp(8px, 1.2vw, 10px);
      }

      .stats {
        justify-content: center;
        align-self: center;
      }

      .desk-info {
        flex-direction: column;
        align-items: flex-start;
        gap: clamp(3px, 0.5vw, 4px);
      }

      .desk-count {
        align-self: flex-start;
      }
    }

    @media (max-width: 480px) {
      .progress-container {
        padding: clamp(12px, 2vw, 15px);
        border-radius: 8px;
      }

      .progress-bar {
        height: 18px;
        border-radius: 9px;
      }

      .progress-fill {
        min-width: 35px;
        padding-right: 6px;
        border-radius: 9px;
      }

      .progress-text {
        font-size: 0.65rem;
      }

      .progress-labels {
        font-size: 0.65rem;
      }

      .desk-stats-title {
        font-size: 0.9rem;
      }

      .desk-name,
      .desk-count {
        font-size: 0.8rem;
      }

      .desk-progress-text {
        font-size: 0.6rem;
        top: -12px;
      }
    }

    @media (max-width: 340px) {
      .progress-container {
        padding: 10px;
      }

      .progress-title {
        font-size: 0.95rem;
        min-width: 150px;
      }

      .stats {
        gap: 8px;
      }

      .completed {
        font-size: 0.8rem;
      }

      .percentage {
        font-size: 0.95rem;
      }

      .progress-bar {
        height: 16px;
      }

      .progress-fill {
        min-width: 30px;
      }

      .progress-text {
        font-size: 0.6rem;
      }

      .progress-labels {
        font-size: 0.6rem;
      }

      .desk-info {
        flex-direction: column;
      }
    }

    @media (min-width: 1024px) {
      .progress-container {
        padding: 25px;
        border-radius: 12px;
      }

      .progress-title {
        font-size: 1.25rem;
      }

      .percentage {
        font-size: 1.25rem;
      }

      .progress-bar {
        height: 26px;
      }

      .progress-text {
        font-size: 0.85rem;
      }

      .desk-stats-title {
        font-size: 1.1rem;
      }

      .desk-name,
      .desk-count {
        font-size: 0.9rem;
      }
    }

    /* Улучшение доступности */
    .progress-bar:focus-within,
    .progress-fill:focus-within {
      outline: 2px solid rgba(52, 152, 219, 0.5);
      outline-offset: 2px;
    }

    /* Улучшение контраста для текста прогресса */
    .progress-fill {
      color: white;
    }

    /* Предотвращение мерцания анимации на мобильных */
    @media (prefers-reduced-motion: reduce) {
      .progress-fill::after {
        animation: none;
      }

      .progress-fill,
      .desk-progress-fill {
        transition-duration: 0.1s;
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
