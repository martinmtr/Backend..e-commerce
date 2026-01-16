import express from "express";
import Cart from "../models/cart.model.js";
import { throwHttpError } from "../utils/httpError.js";

const cartsRouter = express.Router();

/*CREAR CARRITO*/
cartsRouter.post("/", async (req, res, next) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

/*AGREGAR PRODUCTO AL CARRITO */

cartsRouter.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body?.quantity) || 1;

    if (quantity < 1) throwHttpError("La cantidad debe ser mayor a 0", 400);

    const cart = await Cart.findById(cid);
    if (!cart) throwHttpError("Carrito no encontrado", 404);

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    cart.markModified("products");
    await cart.save();

    const populatedCart = await cart.populate("products.product");
    res.status(200).json({ status: "success", payload: populatedCart });
  } catch (error) {
    next(error);
  }
});


cartsRouter.get("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();

    if (!cart) throwHttpError("Carrito no encontrado", 404);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

/*ELIMINAR PRODUCTO DEL CARRITO*/

cartsRouter.delete("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    ).populate("products.product");

    if (!cart) throwHttpError("Carrito no encontrado", 404);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

/* VACIAR CARRITO */
cartsRouter.delete("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );

    if (!cart) throwHttpError("Carrito no encontrado", 404);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

export default cartsRouter;