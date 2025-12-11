import express from "express";
import ProductManager from "../productManager.js";
import uploader from "../utils/uploader.js";

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

viewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/realTimeProducts",async(req, res)=>{
   try{
     const user = {username: "Martin", isAdmin:true} 
    const products = await productManager.getProducts();
     res.render("realTimeProducts", {products, user });
  } catch (error){}
 });

viewsRouter.post(
  "/realTimeProducts",
  uploader.single("file"),
  async (req, res) => {
    try {
      const { title, price, description } = req.body;

      if (!title || !price || !description) {
        return res.status(400).send("Faltan datos");
      }

      const thumbnails = req.file ? "/img/" + req.file.filename : "";

      await productManager.addProduct({
        title,
        price: parseInt(price),
        description,
        thumbnails,
      });

      const products = await productManager.getProducts();

      req.io.emit("products", products);

      res.redirect("/realTimeProducts");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al guardar");
    }
  }
);
viewsRouter.post("/realTimeProducts/delete", async (req, res) => {
  try {
    const { id } = req.body;

    await productManager.deleteProduct(id);

    const products = await productManager.getProducts();

    req.io.emit("products", products);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al eliminar");
  }
});
export default viewsRouter;
