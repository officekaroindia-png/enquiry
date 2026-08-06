import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/enquiries', { params });
      setEnquiries(data.enquiries);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  const addEnquiry = useCallback(async (formData) => {
    try {
      const { data } = await api.post('/enquiries', formData);
      setEnquiries((prev) => [data.enquiry, ...prev]);
      return data.enquiry;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create enquiry');
    }
  }, []);

  const logActivity = useCallback(async (id, { note, newStage }) => {
    try {
      const { data } = await api.patch(`/enquiries/${id}/activity`, { note, newStage });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? data.enquiry : e))
      );
      return data.enquiry;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to log activity');
    }
  }, []);

  const closeWon = useCallback(async (id, note = '') => {
    try {
      const { data } = await api.patch(`/enquiries/${id}/close-won`, { note });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? data.enquiry : e))
      );
      return data.enquiry;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to close as won');
    }
  }, []);

  const closeLost = useCallback(async (id, note = '') => {
    try {
      const { data } = await api.patch(`/enquiries/${id}/close-lost`, { note });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? data.enquiry : e))
      );
      return data.enquiry;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to close as lost');
    }
  }, []);

  const updateEnquiry = useCallback(async (id, updates) => {
    try {
      const { data } = await api.put(`/enquiries/${id}`, updates);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? data.enquiry : e))
      );
      return data.enquiry;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update');
    }
  }, []);

  const removeEnquiry = useCallback(async (id) => {
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete');
    }
  }, []);

  return {
    enquiries,
    loading,
    error,
    fetchAll,
    addEnquiry,
    logActivity,
    closeWon,
    closeLost,
    updateEnquiry,
    removeEnquiry,
  };
}
