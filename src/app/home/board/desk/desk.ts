import {Task} from "./task/task"

export interface Desk {
  id: number;
  name: string;
  tasksList: Task[];
  userId: number;
}
