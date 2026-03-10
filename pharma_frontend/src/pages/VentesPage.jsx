import { useState } from 'react';
import { useVentes } from '../hooks/useVentes';
import { useMedicaments } from '../hooks/useMedicaments';
import { createVente, annulerVente } from '../api/ventesApi';

const VentesPage = () => {
  const { ventes, loading, error, refetch } = useVentes();
  const { medicaments } = useMedicaments();
  const [showForm, setShowForm] = useState(false);
  const [lignes, setLignes] = useState([{ medicament: '', quantite: 1 }]);
  const [formError, setFormError] = useState(null);

  const handleAddLigne = () => setLignes([...lignes, { medicament: '', quantite: 1 }]);

  const handleLigneChange = (index, field, value) => {
    const newLignes = [...lignes];
    newLignes[index][field] = value;
    setLignes(newLignes);
  };

  const handleSubmit = async () => {
    setFormError(null);
    try {
      await createVente({ lignes });
      setShowForm(false);
      setLignes([{ medicament: '', quantite: 1 }]);
      refetch();
    } catch (err) {
      setFormError(JSON.stringify(err.response?.data));
    }
  };

  const handleAnnuler = async (id) => {
    if (window.confirm('Annuler cette vente ?')) {
      try {
        await annulerVente(id);
        refetch();
      } catch (err) {
        alert(err.response?.data?.detail || 'Erreur');
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🧾 Ventes</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle('#2196F3')}>
          + Nouvelle vente
        </button>
      </div>

      {showForm && (
        <div style={formStyle}>
          <h3>Nouvelle vente</h3>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {lignes.map((ligne, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <select value={ligne.medicament} onChange={e => handleLigneChange(index, 'medicament', e.target.value)} style={{ flex: 2, padding: '0.5rem' }}>
                <option value="">Choisir un médicament</option>
                {medicaments.map(m => <option key={m.id} value={m.id}>{m.nom} (stock: {m.stock_actuel})</option>)}
              </select>
              <input type="number" min="1" value={ligne.quantite}
                onChange={e => handleLigneChange(index, 'quantite', parseInt(e.target.value))}
                style={{ flex: 1, padding: '0.5rem' }} placeholder="Qté" />
            </div>
          ))}
          <button onClick={handleAddLigne} style={btnStyle('#FF9800')}>+ Ajouter ligne</button>
          <button onClick={handleSubmit} style={btnStyle('#4CAF50')}>Valider la vente</button>
          <button onClick={() => setShowForm(false)} style={btnStyle('#f44336')}>Annuler</button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead style={{ background: '#f5f5f5' }}>
          <tr>
            <th style={thStyle}>Référence</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Statut</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{v.reference}</td>
              <td style={tdStyle}>{new Date(v.date_vente).toLocaleString('fr-FR')}</td>
              <td style={tdStyle}>{v.total_ttc} MAD</td>
              <td style={tdStyle}>
                <span style={{ color: v.statut === 'annulee' ? 'red' : 'green' }}>
                  {v.statut}
                </span>
              </td>
              <td style={tdStyle}>
                {v.statut !== 'annulee' && (
                  <button onClick={() => handleAnnuler(v.id)} style={btnStyle('#f44336')}>Annuler</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const btnStyle = (bg) => ({ background: bg, color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', margin: '0.2rem' });
const formStyle = { background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginTop: '1rem' };
const thStyle = { padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '0.75rem' };

export default VentesPage;