import { pool } from "../database/connection.js";

export const categoryRepository = {
  async findAll() {
    const result = await pool.query("SELECT * FROM categories");

    return result.rows;
  },

  async create(name) {
    const result = await pool.query(
      `
      INSERT INTO categories(name)
      VALUES($1)
      RETURNING *
      `,
      [name],
    );

    return result.rows[0];
  },
};
