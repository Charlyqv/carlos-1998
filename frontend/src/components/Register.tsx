import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

// export default function Register() {
export default function Register({ onRegisterSuccess }: RegisterProps) {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [co_password, setCoPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');


    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // 1. Validación de frontend: ¿Las contraseñas coinciden?
        if (password !== co_password) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            authService.register(name, email, password);
            setSuccessMessage('Registro exitoso. Redirigiendo al login...');

            setTimeout(() => {
                authService.login(email, password);
                onRegisterSuccess();
                navigate('/');
            }, 1500);

        } catch (error: any) {
            setError(error.message || 'Error al registrar el usuario');
            setLoading(false); // Solo quitamos el loading si hay error
        }
    }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' }}>Registro</h2>
      
      {error && <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '4px', border: '1px solid #f87171' }}>{error}</div>}
      
      {successMessage && (
        <div style={{ backgroundColor: '#dcfce3', color: '#16a34a', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}> */}
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre Completo</label>
          <input
            id="name"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            placeholder="Juan Pérez"
          />
        </div>

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

        <div>
          <label htmlFor="co_password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Confirmar Contraseña</label>
          <input
            id="co_password"
            type="password"
            value={co_password}
            onChange={(e) => setCoPassword(e.target.value)}
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
          {loading ? 'Cargando...' : 'Registrar'}
        </button>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
            <span style={{ color: '#64748b' }}>¿Ya tienes una cuenta? </span>
                <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                    Iniciar Sesión
                </Link>
        </div>
      </form>
    </div>
  );
}