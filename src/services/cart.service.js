import CartModel from "../models/cart.model.js";
import { TicketModel } from "../models/ticket.model.js";
import ProductModel from "../models/product.model.js";

export const purchaseCart = async (cartId, userEmail) => {
    
    const cart = await CartModel.findById(cartId).populate('products.product');
    
    if (!cart) throw new Error("Carrito no encontrado");

    let totalAmount = 0;
    const productsNotPurchased = []; 
    const productsPurchased = []; 

    
    for (const item of cart.products) {
        const product = item.product;

      
        if (!product) {
            console.warn(`Producto con ID ${item.product} no encontrado en la DB, se mantiene en carrito.`);
            productsNotPurchased.push(item);
            continue; 
        }

        
        if (product.stock >= item.quantity) {
            
            await ProductModel.findByIdAndUpdate(product._id, { 
                $inc: { stock: -item.quantity } 
            });
            
            totalAmount += product.price * item.quantity;
            productsPurchased.push(item);
        } else {
            
            productsNotPurchased.push(item);
        }
    }

    let ticket = null;
    if (productsPurchased.length > 0) {
    try {
        console.log("Datos del ticket a crear:", { amount: totalAmount, purchaser: userEmail });
        
         ticket = await TicketModel.create({
            amount: totalAmount,
            purchaser: userEmail
        });
        
        console.log("Ticket guardado exitosamente en DB:", ticket);
       
    } catch (dbError) {
        console.error("¡ERROR CRÍTICO AL GUARDAR EL TICKET EN MONGO!:", dbError);
        throw dbError; 
    }
}
   
    cart.products = productsNotPurchased;
    await cart.save();

    return { ticket, productsNotPurchased };
};