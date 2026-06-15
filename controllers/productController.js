import { productService } from "../services/productService.js";

export const productController = {
  async findAll(req, res) {
    const products = await productService.getAll();

    res.json(products);
  },

  async create(req, res) {
    const product = await productService.create(req.body);

    res.status(201).json(product);
  },
};
