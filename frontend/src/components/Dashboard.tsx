import { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { authService } from '../services/auth.service';
import { Link } from 'react-router-dom';

export default function Dashboard() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const betsData = [
    { name: 'Ganadas', value: 12 },
    { name: 'Perdidas', value: 5 }
  ];

  const DONUT_COLORS = ['#10b981', '#ef4444']; 

  const snailsData = [
    { name: 'Gary', victorias: 1 },
    { name: 'Rayo', victorias: 1 },
    { name: 'Caracola', victorias: 1 }, //Magica
    { name: 'Turbo', victorias: 1 },
    { name: 'Lento', victorias: 0 },
    { name: 'Viscoso', victorias: 2 } //Pero sabroso
  ];

  if (!user) return <div>Cargando...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Hola, {user.name}</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>Bienvenido a tu panel de apuestas.</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Tu saldo actual</span>
          <h3 style={{ margin: 0, color: '#10b981', fontSize: '2rem' }}>${user.balance}</h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: '1rem' }}>Cargar saldo...</h3>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#334155', textAlign: 'center' }}>Historial de Apuestas</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={betsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {betsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} apuestas`, 'Cantidad']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, color: '#334155', textAlign: 'center' }}>Victorias por Caracol</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={snailsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="victorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}