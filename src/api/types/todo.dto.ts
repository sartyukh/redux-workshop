export interface TodoDTO {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
} 