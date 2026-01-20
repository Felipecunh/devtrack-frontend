import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authService } from '../services/apiService';
import './Login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (name.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: name.trim(),
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem('token', response.token);
        
        const registerCard = document.querySelector('.login-card');
        registerCard?.classList.add('success-animation');
        
        setTimeout(() => {
          navigate('/home');
        }, 600);
      } else {
        // Se não retornar token direto, manda pro login
        navigate('/login');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
      
      const registerCard = document.querySelector('.login-card');
      registerCard?.classList.add('error-shake');
      setTimeout(() => {
        registerCard?.classList.remove('error-shake');
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
            <h1 className="logo-text">Criar Conta</h1>
            <p className="logo-subtitle">Junte-se ao DevTrack gratuitamente</p>
          </div>

          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome Completo
              </label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

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
                Senha (mínimo 6 caracteres)
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
                  minLength={6}
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Senha
              </label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
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
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="link-primary">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        <div className="login-features fade-in">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">100% gratuito</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Sem limite de projetos</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span className="feature-text">Interface moderna e intuitiva</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;