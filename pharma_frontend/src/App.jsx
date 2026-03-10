import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';

const App = () => {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <strong style={{ color: 'white', fontSize: '1.2rem' }}>🏥 PharmaManager</strong>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/medicaments" style={linkStyle}>Médicaments</Link>
          <Link to="/ventes" style={linkStyle}>Ventes</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/medicaments" element={<MedicamentsPage />} />
        <Route path="/ventes" element={<VentesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const navStyle = {
  background: '#1a237e',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  margin: 0,
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  background: 'rgba(255,255,255,0.1)',
};

export default App;