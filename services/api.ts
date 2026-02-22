import axios from 'axios';
import { AuthResponse, TaskCreateDto, TaskItem, TaskUpdateDto } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<void> => {
    await apiClient.post('/auth/register', { username, email, password });
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },
};

export const tasksApi = {
  getAll: async (): Promise<TaskItem[]> => {
    const res = await apiClient.get<TaskItem[]>('/tasks');
    return res.data;
  },
  getById: async (id: number): Promise<TaskItem> => {
    const res = await apiClient.get<TaskItem>(`/tasks/${id}`);
    return res.data;
  },
  create: async (dto: TaskCreateDto): Promise<TaskItem> => {
    const res = await apiClient.post<TaskItem>('/tasks', dto);
    return res.data;
  },
  update: async (id: number, dto: TaskUpdateDto): Promise<TaskItem> => {
    const res = await apiClient.put<TaskItem>(`/tasks/${id}`, dto);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
