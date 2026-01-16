import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

/* HOME */
viewsRouter.get("/", async (req, res, next) => {
  try {
    const { limit = 5, page = 1, category } = req.query;

    const filter = {};
    if (category) filter.category = category;

    const productsData = await Product.paginate(filter, {
      limit,
      page,
      lean: true
    });

    const products = productsData.docs;
    delete productsData.docs;

    const links = [];
    for (let i = 1; i <= productsData.totalPages; i++) {
      links.push({
        text: i,
        link: `/?limit=${limit}&page=${i}${category ? `&category=${category}` : ""}`
      });
    }

    res.render("home", {
      products,
      links,
      category
    });

  } catch (error) {
    next(error);
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    const products = await Product.find().lean();
    res.render("realtimeproducts", { products });
});

/* CARRITO */
viewsRouter.get("/cart", async (req, res, next) => {
  try {
    const { cid } = req.query;

    if (!cid) {
      return res.render("cart", { products: [] });
    }

    const cart = await Cart.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.render("cart", { products: [] });
    }

    res.render("cart", {
      products: cart.products
    });

  } catch (error) {
    next(error);
  }
});
viewsRouter.get("/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).render("error", { message: "Producto no encontrado" });
    
    res.render("productDetail", { product }); 
  } catch (error) {
    next(error);
  }
});
export default viewsRouter;

