import { useState, useEffect } from 'react';
import { fetchMedicaments, fetchAlertes } from '../api/medicamentsApi';

export const useMedicaments = (filters = {}) => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMedicaments(filters);
      setMedicaments(data.results || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { medicaments, loading, error, refetch: loadData };
};

export const useAlertes = () => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAlertes();
        setAlertes(data.results || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { alertes, loading };
};