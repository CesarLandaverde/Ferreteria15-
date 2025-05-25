import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts.js";

const Products = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [form, setForm] = useState({ name: "", description: "", price: 0, stock: 0 });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, form);
    } else {
      await createProduct(form);
    }
    setForm({ name: "", description: "", price: 0, stock: 0 });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Productos</h1>

      {loading && <p className="text-gray-600 mb-4">Cargando productos...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md mb-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          {editingId ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition duration-200"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition duration-200"
                    onClick={() => handleDelete(p._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
