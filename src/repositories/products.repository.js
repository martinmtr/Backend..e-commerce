export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (filter, options) => {
        return await this.dao.paginate(filter, options);
    }

    getProductById = async (id) => {
        return await this.dao.findById(id);
    }

    createProduct = async (product) => {
        return await this.dao.create(product);
    }

    updateProduct = async (id, data) => {
        return await this.dao.findByIdAndUpdate(id, data, { new: true });
    }

    deleteProduct = async (id) => {
        return await this.dao.findByIdAndDelete(id);
    }
}