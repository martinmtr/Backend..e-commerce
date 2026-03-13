import { productRepository } from '../dao/factory.js';

export const getProducts = async () => {
    return await productRepository.getAll();
};