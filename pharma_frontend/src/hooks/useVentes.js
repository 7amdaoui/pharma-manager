import { useState, useEffect } from 'react';
import { fetchVentes } from '../api/ventesApi';

export const useVentes = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchVentes();
      setVentes(data.results || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { ventes, loading, error, refetch: loadData };
};