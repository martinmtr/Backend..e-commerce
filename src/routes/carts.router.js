import { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router();
const cartManager = new CartManager("./src/carts.json");


/**CARRITO VACIO */

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**ID DE CARRITO */

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**RUTEO PARA AGREGAR CARRITO**/

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.addProductToCart(cid, pid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router