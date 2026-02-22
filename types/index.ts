export interface User {
  id: number;
  username: string;
  email: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'ToDo' | 'InProgress' | 'Done';
  category: string;
  createdAt: string;
  userId: number;
}

export interface TaskCreateDto {
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'ToDo' | 'InProgress' | 'Done';
  category: string;
}

export type TaskUpdateDto = TaskCreateDto;

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
