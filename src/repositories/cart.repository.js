export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getById(id) {
        return await this.dao.findById(id);
    }

    async update(id, data) {
        return await this.dao.findByIdAndUpdate(id, data, { new: true });
    }
}