import { useState } from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import { createMedicament, deleteMedicament } from '../api/medicamentsApi';
import { fetchCategories } from '../api/categoriesApi';
import { useEffect } from 'react';

const MedicamentsPage = () => {
  const { medicaments, loading, error, refetch } = useMedicaments();
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    nom: '', dci: '', categorie: '', forme: '', dosage: '',
    prix_achat: '', prix_vente: '', stock_actuel: '', stock_minimum: '',
    date_expiration: '', ordonnance_requise: false,
  });

  useEffect(() => {
    fetchCategories().then(data => setCategories(data.results || data));
  }, []);

  const handleSubmit = async () => {
    setFormError(null);
    try {
      await createMedicament(form);
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce médicament ?')) {
      await deleteMedicament(id);
      refetch();
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Chargement...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>💊 Médicaments</h1>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle('#4CAF50')}>
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div style={formStyle}>
          <h3>Nouveau médicament</h3>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          {['nom', 'dci', 'forme', 'dosage', 'prix_achat', 'prix_vente', 'stock_actuel', 'stock_minimum', 'date_expiration'].map(field => (
            <input
              key={field}
              placeholder={field}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={inputStyle}
            />
          ))}
          <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} style={inputStyle}>
            <option value="">Choisir une catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
          <label>
            <input type="checkbox" checked={form.ordonnance_requise}
              onChange={e => setForm({ ...form, ordonnance_requise: e.target.checked })} />
            {' '}Ordonnance requise
          </label>
          <br />
          <button onClick={handleSubmit} style={btnStyle('#4CAF50')}>Sauvegarder</button>
          <button onClick={() => setShowForm(false)} style={btnStyle('#f44336')}>Annuler</button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead style={{ background: '#f5f5f5' }}>
          <tr>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Catégorie</th>
            <th style={thStyle}>Prix vente</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Statut</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map(m => (
            <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{m.nom} <small>({m.dosage})</small></td>
              <td style={tdStyle}>{m.categorie_nom}</td>
              <td style={tdStyle}>{m.prix_vente} MAD</td>
              <td style={tdStyle}>
                <span style={{ color: m.est_en_alerte ? 'red' : 'green', fontWeight: 'bold' }}>
                  {m.stock_actuel} {m.est_en_alerte ? '⚠️' : '✅'}
                </span>
              </td>
              <td style={tdStyle}>{m.ordonnance_requise ? '📋 Ordonnance' : 'Libre'}</td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(m.id)} style={btnStyle('#f44336')}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const btnStyle = (bg) => ({ background: bg, color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', margin: '0.2rem' });
const inputStyle = { display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%', boxSizing: 'border-box' };
const formStyle = { background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginTop: '1rem' };
const thStyle = { padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '0.75rem' };

export default MedicamentsPage;