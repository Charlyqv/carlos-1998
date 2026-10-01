import { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { authService, type User } from '../services/auth.service';
import { transactionService } from '../services/transaction.service';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function Dashboard() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const betsData = [
    { name: 'Ganadas', value: 2 },
    { name: 'Perdidas', value: 4 }
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

  const handleSnailPay = async () => {
    if (!user) return;
    const MySwal = withReactContent(Swal);

    const { value: formValues } = await MySwal.fire({
      title: 'Recarga SnailPay',
      html: `
        <div style="display: flex; flex-direction: column; gap: 15px; text-align: left; margin-top: 10px;">
          <div>
            <label style="font-size: 0.875rem; color: #475569;">Monto a recargar ($)</label>
            <input id="swal-amount" class="swal2-input" type="number" min="1" placeholder="Ej: 500" style="margin: 0; width: 100%; box-sizing: border-box;">
          </div>
          
          <div>
            <label style="font-size: 0.875rem; color: #475569;">Nombre en la tarjeta</label>
            <input id="swal-name" class="swal2-input" placeholder="Titular de la cuenta" style="margin: 0; width: 100%; box-sizing: border-box;">
          </div>

          <div>
            <label style="font-size: 0.875rem; color: #475569;">Número de tarjeta</label>
            <input id="swal-card" class="swal2-input" placeholder="0000 0000 0000 0000" maxlength="16" style="margin: 0; width: 100%; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <label style="font-size: 0.875rem; color: #475569;">Vencimiento</label>
              <input id="swal-exp" class="swal2-input" placeholder="MM/YY" maxlength="5" style="margin: 0; width: 100%; box-sizing: border-box;">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.875rem; color: #475569;">CVV</label>
              <input id="swal-cvv" class="swal2-input" type="password" placeholder="123" maxlength="4" style="margin: 0; width: 100%; box-sizing: border-box;">
            </div>
          </div>
        </div>
          `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Procesar Pago',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',

      didOpen: () => {
        const expInput = document.getElementById('swal-exp') as HTMLInputElement;
        
        expInput.addEventListener('input', (e: any) => {
          let value = e.target.value.replace(/\D/g, ''); 
          
          if (value.length >= 2) {

            let month = parseInt(value.substring(0, 2), 10);
            if (month > 12) value = '12' + value.substring(2);
            if (month === 0) value = '01' + value.substring(2);
            
            if (value.length > 2) {
              value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
          }
          e.target.value = value;
        });
      },
      preConfirm: () => {
        const amount = (document.getElementById('swal-amount') as HTMLInputElement).value;
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const card = (document.getElementById('swal-card') as HTMLInputElement).value;
        const exp = (document.getElementById('swal-exp') as HTMLInputElement).value;
        const cvv = (document.getElementById('swal-cvv') as HTMLInputElement).value;

        if (!amount || !name || !card || !exp || !cvv) {
          Swal.showValidationMessage('Por favor, completa todos los campos de la tarjeta');
          return null;
        }

        if (exp.length !== 5) {
          Swal.showValidationMessage('Formato de fecha inválido. Usa MM/YY');
          return null;
        }

        const [monthStr, yearStr] = exp.split('/');
        const expMonth = parseInt(monthStr, 10);
        const expYear = parseInt(yearStr, 10) + 2000;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        if (expYear < currentYear) {
          Swal.showValidationMessage('La tarjeta está vencida (año expirado)');
          return null;
        }
        
        if (expYear === currentYear && expMonth < currentMonth) {
          Swal.showValidationMessage('La tarjeta está vencida (mes expirado)');
          return null;
        }

        if (Number(amount) <= 0) {
          Swal.showValidationMessage('El monto de recarga debe ser mayor a 0');
          return null;
        }

        return { amount: Number(amount), fullName: name, cardNumber: card, expirationDate: exp, cvv };
      }
    });

    if (formValues) {
      try {
        MySwal.fire({
          title: 'Procesando...',
          text: 'Conectando con SnailPay',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        const response = await fetch('https://api-caracoles.onrender.com/api/snailpay/recharge', { // url para funcionamiento en la nube 
        // const response = await fetch('http://localhost:3000/api/snailpay/recharge', { // url para funcionamiento local
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            ...formValues
          })
        });

        const data = await response.json();

        if (!data.status) {
            throw new Error('No se pudo conectar con SnailPay.');
        }

        transactionService.saveTransaction(data);

        if (data.status === 'approved') {

          const newBalance = user.balance + formValues.amount;
          authService.updateBalance(newBalance);
          setUser({ ...user, balance: newBalance });

          MySwal.fire({
            icon: 'success',
            title: '¡Recarga Exitosa!',
            text: `Se han abonado $${formValues.amount} a tu cuenta.`,
            footer: `Autorización: ${data.authorization_code}`
          });

        } else if (data.status === 'rejected') {

          let reason = 'Tu tarjeta fue declinada por el banco.';
          if (data.status_detail === 'insufficient_funds') reason = 'Fondos insuficientes en la cuenta.';
          if (data.status_detail === 'fraud_suspected') reason = 'Transacción bloqueada por posible fraude.';
          
          MySwal.fire({
            icon: 'warning',
            title: 'Pago Declinado',
            text: reason
          });

        } else if (data.status === 'error') {

          MySwal.fire({
            icon: 'error',
            title: 'Error del Sistema',
            text: 'SnailPay está experimentando problemas técnicos. Intenta más tarde.'
          });
          
        }

      } catch (error: any) {
        MySwal.fire('Error de Conexión', error.message, 'error');
      }
    }
  };

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
          <button 
            onClick={handleSnailPay} 
            style={{ 
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              color: '#10b981', 
              fontSize: '1rem', 
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cargar saldo...
          </button>
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
                  {betsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} apuestas`, 'Cantidad']} />
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