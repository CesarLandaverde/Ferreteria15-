import { useState } from 'react';

// Custom Hook useBrand
const useBrand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:5000/api/products"

  // GET - Obtener todas las marcas
  const getAllBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/brands`);
      if (!response.ok) throw new Error('Error al obtener marcas');
      const data = await response.json();
      setBrands(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // POST - Crear nueva marca
  const createBrand = async (brandData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', brandData.name);
      formData.append('year', brandData.year);
      formData.append('slogan', brandData.slogan);
      if (brandData.image) {
        formData.append('image', brandData.image);
      }

      const response = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Error al crear marca');
      
      await getAllBrands(); // Refresh list
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar marca
  const updateBrand = async (id, brandData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', brandData.name);
      formData.append('year', brandData.year);
      formData.append('slogan', brandData.slogan);
      if (brandData.image) {
        formData.append('image', brandData.image);
      }

      const response = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Error al actualizar marca');
      
      await getAllBrands(); // Refresh list
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar marca
  const deleteBrand = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar marca');
      
      await getAllBrands(); // Refresh list
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    loading,
    error,
    getAllBrands,
    createBrand,
    updateBrand,
    deleteBrand
  };
};

export default useBrand;