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

  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) return;

    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      } else {
        await createProduct({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      }

      setForm({ name: "", description: "", price: "", stock: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error en el submit:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  const filteredProducts = products.filter((p) =>
    (p?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Productos</h1>

      {loading && <p className="text-gray-600 mb-4">Cargando productos...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md mb-6"
      >
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" required className="border p-2 rounded-lg" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required className="border p-2 rounded-lg" />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio" required className="border p-2 rounded-lg" />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required className="border p-2 rounded-lg" />
        <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          {editingId ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
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
                  <button onClick={() => handleEdit(p)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
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
