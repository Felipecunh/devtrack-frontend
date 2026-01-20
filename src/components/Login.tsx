import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../services/apiService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });

      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Animação suave antes de redirecionar
        const loginCard = document.querySelector('.login-card');
        loginCard?.classList.add('success-animation');
        
        setTimeout(() => {
          navigate('/home');
        }, 600);
      } else {
        setError('Token não recebido do servidor');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Email ou senha incorretos';
      setError(errorMessage);
      
      // Efeito de shake no erro
      const loginCard = document.querySelector('.login-card');
      loginCard?.classList.add('error-shake');
      setTimeout(() => {
        loginCard?.classList.remove('error-shake');
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card fade-in">
          <div className="login-logo">
            <div className="logo-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="12" fill="url(#gradient)"/>
                <path d="M32 16L44 28L32 40L20 28L32 16Z" fill="white"/>
                <path d="M32 40L44 52H20L32 40Z" fill="white" opacity="0.7"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64">
                    <stop stopColor="#667eea"/>
                    <stop offset="1" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="logo-text">DevTrack</h1>
            <p className="logo-subtitle">Gerencie seus projetos com eficiência</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className="link-primary">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </div>

        <div className="login-features fade-in">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Organize seus projetos</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Gerencie tarefas facilmente</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Acompanhe seu progresso</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;