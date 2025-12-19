export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  byDesk: {
    deskId: number;
    deskName: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
}
