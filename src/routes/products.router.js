import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const productManager = new ProductManager("./src/products.json");



/**LISTA DE PRODUCTO */

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**PRODUCTO POR ID */
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**RUTEO AGREGAR PRODUCTO */

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/** RUTEO MODIFICAR PRODUCTO */
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


/**RUTEO ELIMINAR PRODUCTO */
router.delete("/:pid", async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;



