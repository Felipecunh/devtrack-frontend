// src/services/apiService.js
import api from "../api/axios";

// Serviços de autenticação
export const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    // A API pode retornar data.data ou só data
    return response.data?.data ?? response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data?.data ?? response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

// Serviços de projetos
export const projectService = {
  // Buscar todos os projetos com paginação opcional
  getAll: async (params) => {
    const response = await api.get("/projects", { params });
    return response.data?.data ?? response.data;
  },

  // Buscar projeto específico por ID
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data?.data ?? response.data;
  },

  // Criar novo projeto
  create: async (data) => {
    const response = await api.post("/projects", data);
    return response.data?.data ?? response.data;
  },

  // Atualizar projeto existente
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data?.data ?? response.data;
  },

  // Deletar projeto
  delete: async (id) => {
    await api.delete(`/projects/${id}`);
  },
};

// Serviços de tarefas
export const taskService = {
  // Buscar tarefas de um projeto específico
  getByProject: async (projectId, params) => {
    const response = await api.get(`/tasks/by-project/${projectId}`, { params });
    return response.data?.data ?? response.data;
  },

  // Criar nova tarefa
  create: async (data) => {
    const response = await api.post("/tasks", data);
    return response.data?.data ?? response.data;
  },

  // Atualizar título da tarefa
  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data?.data ?? response.data;
  },

  // Atualizar apenas o status da tarefa
  updateStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data?.data ?? response.data;
  },

  // Deletar tarefa
  delete: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};