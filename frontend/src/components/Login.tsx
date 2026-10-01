import { useState, type FormEvent } from 'react';
import { Route, useNavigate, Link } from 'react-router-dom';

import { authService } from '../services/auth.service';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
        authService.login(email, password);

        setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        
        setTimeout(() => {
            onLoginSuccess();
            navigate('/');
        }, 1500);

    } catch (error: any) {
        console.error(error.message);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' }}>Iniciar Sesión</h2>
      
      {error && <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', border: '1px solid #f87171' }}>{error}</div>}
      {successMessage && <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '4px', border: '1px solid #86efac' }}>{successMessage}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            placeholder="test@test.com"
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b' }}>¿No tienes una cuenta? </span>
                <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                    Crear usuario nuevo
                </Link>
        </div>
      </form>
    </div>
  );
}