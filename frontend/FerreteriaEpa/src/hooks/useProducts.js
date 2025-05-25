import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL; // cambia según tu backend

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const newProduct = await res.json();
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = async (id, updated) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const updatedProduct = await res.json();
    setProducts((prev) => prev.map(p => (p._id === id ? updatedProduct : p)));
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter(p => p._id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
