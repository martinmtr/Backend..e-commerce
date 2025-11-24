import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  /*CREAR CARRITO CON ID*/

  
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: crypto.randomUUID(),
      products: []
    };
    
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }


/*AGREGAR PRODUCTO MEDIANTE ID DE CARTS Y PRODUCT*/
  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id == cid);

    if (cartIndex === -1) throw new Error("Carrito no encontrado");

    const productIndex = carts[cartIndex].products.findIndex(p => p.product == pid);

    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: pid, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
  }
}

export default CartManager;
