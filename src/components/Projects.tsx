import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiPlus,
  FiSearch,
  FiFolder,
  FiCalendar,
  FiList
} from 'react-icons/fi';
import { projectService, taskService } from '../services/apiService';
import './Projects.css';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: number;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  tasks?: Task[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll({ pageSize: 50 });
      const projectList = response.items || response || [];
      setProjects(projectList);
      setFilteredProjects(projectList);
    } catch (err: any) {
      setError('Falha ao carregar projetos');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

    try {
      await projectService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      showToast('Projeto excluído com sucesso', 'success');
    } catch {
      showToast('Erro ao excluir projeto', 'error');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditProjectName(project.name);
  };

  const handleSaveProjectEdit = async (id: string) => {
    if (!editProjectName.trim()) {
      showToast('O nome não pode estar vazio', 'error');
      return;
    }

    try {
      await projectService.update(id, { name: editProjectName });
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, name: editProjectName } : p))
      );
      setEditingProjectId(null);
      showToast('Projeto atualizado', 'success');
    } catch {
      showToast('Erro ao atualizar projeto', 'error');
    }
  };

  const handleCancelProjectEdit = () => {
    setEditingProjectId(null);
    setEditProjectName('');
  };

  const handleDeleteTask = async (taskId: string, projectId: string, taskTitle: string) => {
    if (!window.confirm(`Excluir tarefa "${taskTitle}"?`)) return;

    try {
      await taskService.delete(taskId);
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, tasks: project.tasks?.filter((t) => t.id !== taskId) }
            : project
        )
      );
      showToast('Tarefa excluída', 'success');
    } catch {
      showToast('Erro ao excluir tarefa', 'error');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
  };

  const handleSaveTaskEdit = async (taskId: string, projectId: string) => {
    if (!editTaskTitle.trim()) {
      showToast('O título não pode estar vazio', 'error');
      return;
    }

    try {
      await taskService.update(taskId, { title: editTaskTitle });
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks?.map((t) =>
                  t.id === taskId ? { ...t, title: editTaskTitle } : t
                ),
              }
            : project
        )
      );
      setEditingTaskId(null);
      showToast('Tarefa atualizada', 'success');
    } catch {
      showToast('Erro ao atualizar tarefa', 'error');
    }
  };

  const handleCancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditTaskTitle('');
  };

  const handleChangeTaskStatus = async (task: Task, projectId: string) => {
    const nextStatus = (task.status + 1) % 3;

    try {
      await taskService.updateStatus(task.id, nextStatus);

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks?.map((t) =>
                  t.id === task.id ? { ...t, status: nextStatus } : t
                ),
              }
            : project
        )
      );

      const statusNames = ['Pendente', 'Em Progresso', 'Concluída'];
      showToast(`Status: ${statusNames[nextStatus]}`, 'success');
    } catch {
      showToast('Erro ao alterar status', 'error');
    }
  };

  const getTaskStatusInfo = (status: number) => {
    const statusMap: Record<number, { label: string; class: string }> = {
      0: { label: 'Pendente', class: 'badge-warning' },
      1: { label: 'Em Progresso', class: 'badge-info' },
      2: { label: 'Concluída', class: 'badge-success' },
    };
    return statusMap[status] || statusMap[0];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data não disponível';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (loading) {
    return (
      <div className="projects-wrapper">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-wrapper">
        <div className="container">
          <div className="alert alert-error">{error}</div>
          <button onClick={() => navigate('/home')} className="btn btn-primary">
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-wrapper">
      <div className="projects-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="page-title">Meus Projetos</h1>
              <p className="page-subtitle">
                {filteredProjects.length} projeto(s) encontrado(s)
              </p>
            </div>
            <div className="header-actions">
              <button onClick={() => navigate('/home')} className="btn btn-outline">
                <FiArrowLeft />
                Voltar
              </button>
              <button
                onClick={() => navigate('/create-project')}
                className="btn btn-primary"
              >
                <FiPlus />
                Novo Projeto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-state">
            <FiFolder size={80} className="empty-icon" />
            <h2>Nenhum projeto encontrado</h2>
            <p>Comece criando seu primeiro projeto</p>
            <button
              onClick={() => navigate('/create-project')}
              className="btn btn-primary btn-lg"
            >
              <FiPlus />
              Criar Primeiro Projeto
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="project-card fade-in">
                <div className="project-header">
                  {editingProjectId === project.id ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editProjectName}
                      onChange={(e) => setEditProjectName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <h3 className="project-title">{project.name}</h3>
                  )}

                  <div className="project-actions">
                    {editingProjectId === project.id ? (
                      <>
                        <button
                          onClick={() => handleSaveProjectEdit(project.id)}
                          className="btn-icon btn-success"
                          title="Salvar"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={handleCancelProjectEdit}
                          className="btn-icon btn-danger"
                          title="Cancelar"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="btn-icon"
                          title="Editar nome"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          className="btn-icon btn-danger"
                          title="Excluir projeto"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="project-meta">
                  <span className="meta-item">
                    <FiCalendar size={14} />
                    {formatDate(project.createdAt)}
                  </span>
                  <span className="meta-item">
                    <FiList size={14} />
                    {project.tasks?.length || 0} tarefa(s)
                  </span>
                </div>

                {project.tasks && project.tasks.length > 0 && (
                  <div className="tasks-list">
                    <h4 className="tasks-title">Tarefas</h4>
                    {project.tasks.map((task) => {
                      const statusInfo = getTaskStatusInfo(task.status);
                      return (
                        <div key={task.id} className="task-item-enhanced">
                          <div className="task-content">
                            {editingTaskId === task.id ? (
                              <input
                                type="text"
                                className="form-input task-input-edit"
                                value={editTaskTitle}
                                onChange={(e) => setEditTaskTitle(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              <>
                                <span className="task-title">{task.title}</span>
                                <span
                                  className={`badge ${statusInfo.class} badge-clickable`}
                                  onClick={() => handleChangeTaskStatus(task, project.id)}
                                  title="Clique para mudar o status"
                                >
                                  {statusInfo.label}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="task-actions">
                            {editingTaskId === task.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveTaskEdit(task.id, project.id)}
                                  className="btn-icon-sm btn-success"
                                  title="Salvar"
                                >
                                  <FiCheck size={14} />
                                </button>
                                <button
                                  onClick={handleCancelTaskEdit}
                                  className="btn-icon-sm btn-danger"
                                  title="Cancelar"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="btn-icon-sm"
                                  title="Editar"
                                >
                                  <FiEdit2 size={13} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteTask(task.id, project.id, task.title)
                                  }
                                  className="btn-icon-sm btn-danger"
                                  title="Excluir"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => navigate('/create-task')}
                  className="btn btn-secondary btn-sm add-task-btn"
                >
                  <FiPlus />
                  Adicionar Tarefa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;