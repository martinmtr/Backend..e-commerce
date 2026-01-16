import Product from "../models/product.model.js";
import { throwHttpError } from "../utils/httpError.js";
import { io } from "../app.js"; 

export const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const productsData = await Product.paginate({}, { limit, page, lean: true });
    const products = productsData.docs;
    delete productsData.docs;

    res.status(200).json({ status: "success", payload: products, ...productsData });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const productData = req.body;

   
    if (req.files && req.files.length > 0) {
      productData.thumbnails = req.files.map(file => `/img/${file.filename}`);
    } else if (typeof productData.thumbnails === 'string') {
      
      productData.thumbnails = [productData.thumbnails];
    }

    const newProduct = await Product.create(productData);

    
    io.emit("productAdded", newProduct);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    next(error);
  }
};

export const setProductById = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true, runValidators: true });
    if (!updatedProduct) throwHttpError("Producto no encontrado", 404);

    
    io.emit("productUpdated", updatedProduct);

    res.status(200).json({ status: "success", payload: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProductById = async (req, res, next) => {
  try {
    const pid = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (!deletedProduct) throwHttpError("Producto no encontrado", 404);

    
    io.emit("productDeleted", pid);

    res.status(200).json({ status: "success", payload: deletedProduct });
  } catch (error) {
    next(error);
  }
};