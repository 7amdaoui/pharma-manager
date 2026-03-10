import { useMedicaments, useAlertes } from '../hooks/useMedicaments';
import { useVentes } from '../hooks/useVentes';

const DashboardPage = () => {
  const { medicaments, loading: loadingMeds } = useMedicaments();
  const { alertes } = useAlertes();
  const { ventes } = useVentes();

  const today = new Date().toISOString().split('T')[0];
  const ventesAujourdhui = ventes.filter(v =>
    v.date_vente?.startsWith(today)
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏥 PharmaManager — Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={cardStyle('#4CAF50')}>
          <h2>{loadingMeds ? '...' : medicaments.length}</h2>
          <p>Médicaments actifs</p>
        </div>
        <div style={cardStyle('#f44336')}>
          <h2>{alertes.length}</h2>
          <p>⚠️ Alertes stock</p>
        </div>
        <div style={cardStyle('#2196F3')}>
          <h2>{ventesAujourdhui.length}</h2>
          <p>Ventes aujourd'hui</p>
        </div>
        <div style={cardStyle('#FF9800')}>
          <h2>{ventes.length}</h2>
          <p>Total ventes</p>
        </div>
      </div>

      {alertes.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>⚠️ Médicaments en rupture de stock</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Stock actuel</th>
                <th>Stock minimum</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map(m => (
                <tr key={m.id} style={{ background: '#fff3f3' }}>
                  <td>{m.nom}</td>
                  <td style={{ color: 'red', fontWeight: 'bold' }}>{m.stock_actuel}</td>
                  <td>{m.stock_minimum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cardStyle = (color) => ({
  background: color,
  color: 'white',
  padding: '1.5rem',
  borderRadius: '8px',
  minWidth: '150px',
  textAlign: 'center',
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
};

export default DashboardPage;