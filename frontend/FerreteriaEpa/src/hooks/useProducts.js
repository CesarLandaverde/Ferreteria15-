import { useState, useEffect } from "react";

const API_URL = "https://ferreteria15.onrender.com/api/products";

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
      setError("Error al obtener productos");
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

    if (!res.ok) {
      throw new Error("Error al crear producto");
    }

    const newProduct = await res.json();
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = async (id, updated) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) throw new Error("Error al actualizar producto");

    const updatedProduct = await res.json();
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? updatedProduct : p))
    );
  };

  const deleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar producto");

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
