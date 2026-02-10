import Product from "../models/product.model.js";
import { throwHttpError } from "../utils/httpError.js";
import { io } from "../app.js"; 

export const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // 1. Configuración de Filtro (por categoría o disponibilidad)
    const filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    // 2. Opciones de Paginación y Ordenamiento
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    const result = await Product.paginate(filter, options);

    // 3. Construcción de links (prevLink y nextLink)
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const searchParams = `${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`;
    
    const prevLink = result.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${searchParams}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${searchParams}` : null;

    res.status(200).json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
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
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true, runValidators: true });
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