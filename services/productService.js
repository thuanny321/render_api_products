import { productRepository } from "../repositories/productRepository.js";

export const productService = {
  async getAll() {
    return await productRepository.findAll();
  },

  async create(data) {
    return await productRepository.create(data);
  },
};
