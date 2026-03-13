import express from "express";
import passport from "passport"; 
import { authorize } from "../middlewares/auth.middleware.js"; 
import {
  getAllProducts,
  addProduct,       
  setProductById,   
  deleteProductById 
} from "../controllers/products.controller.js";
import { uploader } from "../utils/multer.js";

const productsRouter = express.Router();

// PUBLICO
productsRouter.get("/", getAllProducts);

// ADMIN
productsRouter.post(
    "/", 
    passport.authenticate("current", { session: false }), 
    authorize(["admin"]), 
    uploader.array("thumbnails"), 
    addProduct 
);


productsRouter.put(
    "/:pid", 
    passport.authenticate("current", { session: false }), 
    authorize(["admin"]), 
    setProductById 
);


productsRouter.delete(
    "/:pid", 
    passport.authenticate("current", { session: false }), 
    authorize(["admin"]), 
    deleteProductById 
);

productsRouter.delete("/products/:pid", 
    passport.authenticate("current", { session: false }), 
    authorize(["admin"]), 
    async (req, res) => {
      
        res.status(200).json({ status: "success", message: "Producto eliminado" });
    }
);

export default productsRouter;
