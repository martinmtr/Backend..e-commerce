import ProductDao from './dao/product.dao.js';
import ProductRepository from './repositories/product.repository.js';

const dao = new ProductDao(); 
export const productRepository = new ProductRepository(dao);