import { UserModel } from "../models/user.model.js";
import ProductRepository from "../repositories/products.repository.js";
import UserRepository from "../repositories/user.repository.js";
import Product from "../models/product.model.js";

export const productService = new ProductRepository(Product);
export const userService = new UserRepository(UserModel);