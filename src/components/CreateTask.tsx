import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckSquare, FiCheck, FiFolder } from 'react-icons/fi';
import { projectService, taskService } from '../services/apiService';
import './Form.css';

interface Project {
  id: string;
  name: string;
}

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll({ pageSize: 100 });
      const projectList = response.items || response || [];
      setProjects(projectList);
      
      // Se tiver só um projeto, já seleciona automaticamente
      if (projectList.length === 1) {
        setProjectId(projectList[0].id);
      }
    } catch (err) {
      setError('Erro ao carregar projetos');
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('O título da tarefa não pode estar vazio');
      return;
    }

    if (!projectId) {
      setError('Selecione um projeto');
      return;
    }

    if (title.length > 150) {
      setError('O título deve ter no máximo 150 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await taskService.create({ 
        title: title.trim(), 
        projectId 
      });
      
      const toast = document.createElement('div');
      toast.className = 'success-toast';
      toast.textContent = `Tarefa "${title}" criada com sucesso!`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
        navigate('/projects');
      }, 1500);
      
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Erro ao criar tarefa. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProjects) {
    return (
      <div className="form-wrapper">
        <div className="container">
          <div className="spinner"></div>
          <p style={{ textAlign: 'center', color: 'white', marginTop: '16px' }}>
            Carregando projetos...
          </p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="form-wrapper">
        <div className="container">
          <div className="form-container fade-in">
            <div className="empty-state">
              <FiFolder size={80} className="empty-icon" />
              <h2>Nenhum projeto encontrado</h2>
              <p>Você precisa criar um projeto antes de adicionar tarefas</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/create-project')}
                  className="btn btn-primary btn-lg"
                >
                  Criar Projeto
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="btn btn-outline btn-lg"
                >
                  <FiArrowLeft />
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <div className="container">
          <button onClick={() => navigate('/home')} className="btn-back">
            <FiArrowLeft />
            Voltar
          </button>
        </div>
      </div>

      <div className="container">
        <div className="form-container fade-in">
          <div className="form-icon">
            <FiCheckSquare size={64} />
          </div>
          <h1 className="form-title">Criar Nova Tarefa</h1>
          <p className="form-subtitle">
            Adicione uma nova tarefa a um dos seus projetos
          </p>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Título da Tarefa
              </label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Implementar autenticação"
                maxLength={150}
                required
              />
              <div className="form-helper">
                {title.length}/150 caracteres
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="project" className="form-label">
                Projeto
              </label>
              <select
                id="project"
                className="form-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">Selecione um projeto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="form-helper">
                {projects.length} projeto(s) disponível(is)
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Criando...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Criar Tarefa
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="form-tips">
            <h3>Dicas</h3>
            <ul>
              <li>Seja específico no título da tarefa</li>
              <li>Você pode adicionar várias tarefas ao mesmo projeto</li>
              <li>O status inicial será "Pendente"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;