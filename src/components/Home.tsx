import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiFolder, FiPlusCircle, FiCheckSquare, FiClock, FiTrendingUp } from 'react-icons/fi';
import { authService, projectService } from '../services/apiService';
import './Home.css';

interface Stats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Busco todos os projetos pra calcular as estatísticas
      const response = await projectService.getAll({ pageSize: 100 });
      const projects = response.items || [];
      
      let totalTasks = 0;
      let completedTasks = 0;
      
      // Percorro cada projeto contando as tasks
      projects.forEach((project: any) => {
        if (project.tasks) {
          totalTasks += project.tasks.length;
          // Status 2 significa concluída
          completedTasks += project.tasks.filter((t: any) => t.status === 2).length;
        }
      });

      setStats({
        totalProjects: projects.length,
        totalTasks,
        completedTasks,
        pendingTasks: totalTasks - completedTasks,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Cards de ações rápidas
  const quickActions = [
    {
      title: 'Ver Projetos',
      description: 'Gerencie seus projetos existentes',
      icon: FiFolder,
      color: '#4CAF50',
      action: () => navigate('/projects'),
    },
    {
      title: 'Novo Projeto',
      description: 'Crie um novo projeto',
      icon: FiPlusCircle,
      color: '#2196F3',
      action: () => navigate('/create-project'),
    },
    {
      title: 'Nova Tarefa',
      description: 'Adicione uma nova tarefa',
      icon: FiCheckSquare,
      color: '#FF9800',
      action: () => navigate('/create-task'),
    },
  ];

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="header-title">DevTrack</h1>
              <p className="header-subtitle">Bem-vindo de volta</p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              <FiLogOut />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="home-main container">
        <section className="stats-section fade-in">
          <h2 className="section-title">Visão Geral</h2>
          
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card" style={{ borderLeftColor: '#4CAF50' }}>
                <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                  <FiFolder size={28} color="#4CAF50" />
                </div>
                <div className="stat-info">
                  <h3 className="stat-number">{stats.totalProjects}</h3>
                  <p className="stat-label">Projetos</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#2196F3' }}>
                <div className="stat-icon" style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
                  <FiCheckSquare size={28} color="#2196F3" />
                </div>
                <div className="stat-info">
                  <h3 className="stat-number">{stats.totalTasks}</h3>
                  <p className="stat-label">Total de Tarefas</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#4CAF50' }}>
                <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                  <FiTrendingUp size={28} color="#4CAF50" />
                </div>
                <div className="stat-info">
                  <h3 className="stat-number">{stats.completedTasks}</h3>
                  <p className="stat-label">Concluídas</p>
                </div>
              </div>

              <div className="stat-card" style={{ borderLeftColor: '#FF9800' }}>
                <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                  <FiClock size={28} color="#FF9800" />
                </div>
                <div className="stat-info">
                  <h3 className="stat-number">{stats.pendingTasks}</h3>
                  <p className="stat-label">Pendentes</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="actions-section fade-in">
          <h2 className="section-title">Ações Rápidas</h2>
          
          <div className="actions-grid">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div
                  key={index}
                  className="action-card"
                  onClick={action.action}
                  style={{ '--accent-color': action.color } as React.CSSProperties}
                >
                  <div className="action-icon">
                    <IconComponent size={40} />
                  </div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                  <div className="action-arrow">→</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;