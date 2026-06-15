import { categoryRepository } from "../repositories/categoryRepository.js";

export const categoryService = {
  async getAll() {
    return await categoryRepository.findAll();
  },

  async create(name) {
    return await categoryRepository.create(name);
  },
};
