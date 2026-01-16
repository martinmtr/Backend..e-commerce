import Product from "../models/product.model.js";
import { throwHttpError } from "../utils/httpError.js";
import { io } from "../app.js"; 

export const getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtro dinámico (por categoría o disponibilidad)
    const filter = {};
    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    // Opciones de paginación y ordenamiento
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    };

    const productsData = await Product.paginate(filter, options);

    // Construcción de links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const prevLink = productsData.hasPrevPage ? `${baseUrl}?limit=${limit}&page=${productsData.prevPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null;
    const nextLink = productsData.hasNextPage ? `${baseUrl}?limit=${limit}&page=${productsData.nextPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}` : null;

    res.status(200).json({
      status: "success",
      payload: productsData.docs,
      totalPages: productsData.totalPages,
      prevPage: productsData.prevPage,
      nextPage: productsData.nextPage,
      page: productsData.page,
      hasPrevPage: productsData.hasPrevPage,
      hasNextPage: productsData.hasNextPage,
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
    } else  {
      
      productData.thumbnails = productData.thumbnails || [];
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