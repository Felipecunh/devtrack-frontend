// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Projects from './components/Projects';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateProject from './components/CreateProject';
import CreateTask from './components/CreateTask';

const App = () => {
  const navigate = useNavigate();

  // Redirecionar para a Home se já estiver autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    
    // Se está autenticado e está na página de login, redireciona para home
    if (isAuthenticated && (currentPath === '/' || currentPath === '/login')) {
      navigate('/home');
    }
  }, [navigate]);

  // Componente de rota protegida
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = localStorage.getItem('token');

    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;