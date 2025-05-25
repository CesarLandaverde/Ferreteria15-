import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Upload, Calendar, Tag, Type } from 'lucide-react';
import useBrand from '../hooks/useBrand.js'; // Importar el hook

// Componente del Formulario
const BrandForm = ({ brand, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    year: brand?.year || '',
    slogan: brand?.slogan || '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(brand?.image || '');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {brand ? 'Editar Marca' : 'Nueva Marca'}
      </h3>
      
      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 mr-2" />
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Año */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Año
          </label>
          <input
            type="text"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Slogan */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 mr-2" />
            Slogan
          </label>
          <textarea
            name="slogan"
            value={formData.slogan}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Upload className="w-4 h-4 mr-2" />
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de la Lista de Marcas
const BrandList = ({ brands, onEdit, onDelete }) => {
  if (brands.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay marcas registradas
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <div key={brand._id} className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
          {brand.image && (
            <img 
              src={brand.image} 
              alt={brand.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{brand.name}</h3>
            <p className="text-gray-600 mb-2">Año: {brand.year}</p>
            <p className="text-gray-700 text-sm mb-4">{brand.slogan}</p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(brand)}
                className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Editar
              </button>
              <button
                onClick={() => onDelete(brand._id)}
                className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente Principal
const Brand = () => {
  const { brands, loading, error, getAllBrands, createBrand, updateBrand, deleteBrand } = useBrand();
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    getAllBrands();
  }, []);

  const handleSave = async (brandData) => {
    let success = false;
    
    if (editingBrand) {
      success = await updateBrand(editingBrand._id, brandData);
    } else {
      success = await createBrand(brandData);
    }

    if (success) {
      setShowForm(false);
      setEditingBrand(null);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta marca?')) {
      await deleteBrand(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(null);
  };

  if (loading && brands.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Marcas</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Marca
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error: {error}
          </div>
        )}

        {showForm ? (
          <BrandForm
            brand={editingBrand}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <BrandList
            brands={brands}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {loading && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Procesando...
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;