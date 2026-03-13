import express from "express";
import Cart from "../models/cart.model.js";
import { throwHttpError } from "../utils/httpError.js";
import { purchaseCart } from "../services/cart.service.js";
import passport from "passport";
import {authorize}  from '../middlewares/auth.middleware.js';
const cartsRouter = express.Router();

// CREAR CARRITO
cartsRouter.post("/", async (req, res, next) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

// TRAER CARRITO CON POPULATE
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

// AGREGAR PRODUCTO AL CARRITO
cartsRouter.post("/:cid/product/:pid",authorize(['user']) , async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const quantity = Number(req.body?.quantity) || 1;
    const cart = await Cart.findById(cid);
    if (!cart) throwHttpError("Carrito no encontrado", 404);

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

// ELIMINAR PRODUCTO ESPECÍFICO DEL CARRITO
cartsRouter.delete("/:cid/product/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    if (!cart) throwHttpError("Carrito no encontrado", 404);
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
});

// VACIAR CARRITO COMPLETAMENTE
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
cartsRouter.post("/:cid/purchase", async (req, res) => {
  
    try {
        const { cid } = req.params;
       
        const userEmail = req.body.email; 

        const result = await purchaseCart(cid, userEmail);
        
        res.json({ status: "success", ticket: result.ticket });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});



export default cartsRouter;