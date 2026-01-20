import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFolder, FiCheck } from 'react-icons/fi';
import { projectService } from '../services/apiService';
import './Form.css';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome do projeto não pode estar vazio');
      return;
    }

    if (name.length > 100) {
      setError('O nome deve ter no máximo 100 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await projectService.create({ name: name.trim() });
      
      // Toast de sucesso
      const toast = document.createElement('div');
      toast.className = 'success-toast';
      toast.textContent = `Projeto "${name}" criado com sucesso!`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
        navigate('/projects');
      }, 1500);
      
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Erro ao criar projeto. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

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
            <FiFolder size={64} />
          </div>
          <h1 className="form-title">Criar Novo Projeto</h1>
          <p className="form-subtitle">
            Organize suas tarefas criando um novo projeto
          </p>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome do Projeto
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sistema de Vendas"
                maxLength={100}
                required
              />
              <div className="form-helper">
                {name.length}/100 caracteres
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
                    Criar Projeto
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="form-tips">
            <h3>Dicas</h3>
            <ul>
              <li>Escolha um nome descritivo e fácil de identificar</li>
              <li>Você pode editar o nome depois se necessário</li>
              <li>Após criar, você poderá adicionar tarefas ao projeto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;