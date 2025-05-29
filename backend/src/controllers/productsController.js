import productsModel from "../models/Products.js";

const productsController = {};

// SELECT - Obtener todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// INSERT - Crear un producto nuevo
productsController.createProducts = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const newProduct = new productsModel({ name, description, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct); // ← Devolver el producto creado
  } catch (err) {
    res.status(500).json({ message: "Error al guardar el producto" });
  }
};

// DELETE - Eliminar un producto
productsController.deleteProducts = async (req, res) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

// UPDATE - Actualizar un producto
productsController.updateProducts = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const updatedProduct = await productsModel.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct); // ← Devolver el producto actualizado
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export default productsController;
