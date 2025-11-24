import fs from "fs/promises";
import crypto from "crypto";

class ProductManager {
  constructor(path) {
    this.path = path;
  }
  
/*AGREGAR PRODUCTO*/
  async addProduct(product) {
    try {
      const products = await this.getProducts();
      
        const requiredFields = ["title", "description", "price", "code", "stock", "category"];

    for (const field of requiredFields) {
      if (product[field] === undefined || product[field] === null || product[field] === "") {
        throw new Error(`El campo '${field}' es obligatorio`);
      }
    }

      const newProduct = {
        id: crypto.randomUUID(), 
        status: true,            
        thumbnails: [],          
        ...product
      };

      products.push(newProduct);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar producto: " + error.message);
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }


/*PRODUCTO POR ID*/
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id == id); 
      if (!product) throw new Error("Producto no encontrado");
      return product;
    } catch (error) {
      throw error;
    }
  }


/*MODIFICAR PRODUCTO*/
  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id == id);

      if (index === -1) throw new Error("Producto no encontrado");

      const updatedProduct = { ...products[index], ...updates, id: products[index].id };
      products[index] = updatedProduct;

      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }


/*ELIMINAR PRODUCTO*/
  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const newProducts = products.filter((p) => p.id != id);

      if (products.length === newProducts.length) {
        throw new Error("Producto no encontrado para eliminar");
      }

      await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;