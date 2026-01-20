// src/types/index.ts

// Auth Types
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Project Types
export interface CreateProjectDto {
  name: string;
}

export interface UpdateProjectDto {
  name: string;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  tasks?: Task[];
}

// Task Types
export interface CreateTaskDto {
  title: string;
  projectId: string;
}

export interface UpdateTaskDto {
  title: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: number;
  projectId: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}