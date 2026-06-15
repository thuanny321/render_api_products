import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  async findAll(req, res) {
    const categories = await categoryService.getAll();

    res.json(categories);
  },

  async create(req, res) {
    const category = await categoryService.create(req.body.name);

    res.status(201).json(category);
  },
};
