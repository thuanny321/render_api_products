import { pool } from "../database/connection.js";

export const productRepository = {
  async findAll() {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.price,
        c.name AS category
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
    `);

    return result.rows;
  },

  async create(product) {
    const result = await pool.query(
      `
      INSERT INTO products
      (name, price, category_id)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [product.name, product.price, product.categoryId],
    );

    return result.rows[0];
  },
};
