import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit3, Plus, X, Check } from 'lucide-react';

// Hook personalizado para manejar las reseñas
const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/reviews`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al crear la reseña');
      await fetchReviews();
      return { success: true, message: 'Reseña creada exitosamente' };
    } catch (error) {
      console.error('Error creating review:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al actualizar la reseña');
      await fetchReviews();
      return { success: true, message: 'Reseña actualizada exitosamente' };
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al eliminar la reseña');
      await fetchReviews();
      return { success: true, message: 'Reseña eliminada exitosamente' };
    } catch (error) {
      console.error('Error deleting review:', error);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview };
};

// Hook personalizado para manejar clientes
const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/customers`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  return { clients, loading, error, fetchClients };
};

const ReviewsApp = () => {
  const { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview } = useReviews();
  const { clients, fetchClients } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({ comment: '', rating: 5, idClient: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSubmit = async () => {
    if (!formData.comment.trim() || !formData.idClient) {
      showMessage('Por favor completa todos los campos', 'error');
      return;
    }

    const result = editingReview
      ? await updateReview(editingReview._id, formData)
      : await createReview(formData);

    showMessage(result.message, result.success ? 'success' : 'error');
    if (result.success) resetForm();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reseña?')) return;
    const result = await deleteReview(id);
    showMessage(result.message, result.success ? 'success' : 'error');
  };

  const resetForm = () => {
    setFormData({ comment: '', rating: 5, idClient: '' });
    setShowForm(false);
    setEditingReview(null);
  };

  const startEdit = (review) => {
    setFormData({
      comment: review.comment,
      rating: review.rating,
      idClient: review.idClient._id || review.idClient
    });
    setEditingReview(review);
    setShowForm(true);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));

  const getClientName = (review) => {
    if (review.idClient && typeof review.idClient === 'object') {
      return review.idClient.name || 'Cliente desconocido';
    }
    const client = clients.find((c) => c._id === review.idClient);
    return client ? client.name : 'Cliente desconocido';
  };

  useEffect(() => {
    fetchReviews();
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Reseñas</h1>
              <p className="text-gray-600 mt-2">Gestiona las reseñas de tus clientes</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Reseña
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingReview ? 'Editar Reseña' : 'Nueva Reseña'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <select
                    value={formData.idClient}
                    onChange={(e) => setFormData({ ...formData, idClient: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Escribe tu comentario aquí..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {editingReview ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Reseñas ({reviews.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando reseñas...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No hay reseñas disponibles</p>
              <p className="text-sm mt-1">Crea la primera reseña usando el botón de arriba</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{getClientName(review)}</h3>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600 ml-1">({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => startEdit(review)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(review._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsApp;
