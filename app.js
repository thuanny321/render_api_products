import express from "express";
import cors from "cors";

import routes from "./routes/index.js";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";

import pg from "pg";
const { Client } = pg;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

async function inicializarBanco() {
  const client = new Client({
    connectionString:
      "postgres://admin:vLdQ7edWKnLhO0s5IOJpYsa61UVOhQtt@dpg-d8nksburnols73dsn8ig-a.ohio-postgres.render.com/products_db_vaav?ssl=true",
  });

  try {
    await client.connect();

    const queryTabelas = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        category_id INTEGER REFERENCES categories(id)
      );
    `;
    await client.query(queryTabelas);
    console.log("Estrutura do banco verificada/criada com sucesso!");

    const resultado = await client.query("SELECT COUNT(*) FROM categories");
    const quantidade = parseInt(resultado.rows[0].count);

    if (quantidade === 0) {
      console.log("Banco vazio! Inserindo dados de teste...");

      // Categorias
      const eletr = await client.query(
        "INSERT INTO categories (name) VALUES ('Eletrônicos') RETURNING id",
      );

      const roupas = await client.query(
        "INSERT INTO categories (name) VALUES ('Roupas') RETURNING id",
      );

      const casa = await client.query(
        "INSERT INTO categories (name) VALUES ('Casa e Decoração') RETURNING id",
      );

      const esportes = await client.query(
        "INSERT INTO categories (name) VALUES ('Esportes') RETURNING id",
      );

      const livros = await client.query(
        "INSERT INTO categories (name) VALUES ('Livros') RETURNING id",
      );

      const idEletr = eletr.rows[0].id;
      const idRoupas = roupas.rows[0].id;
      const idCasa = casa.rows[0].id;
      const idEsportes = esportes.rows[0].id;
      const idLivros = livros.rows[0].id;

      await client.query(`
    INSERT INTO products (name, price, category_id) VALUES

    -- Eletrônicos
    ('Smartphone Galaxy', 2499.90, ${idEletr}),
    ('Notebook Gamer', 5499.90, ${idEletr}),
    ('Monitor 24 Polegadas', 899.90, ${idEletr}),
    ('Mouse Sem Fio', 89.90, ${idEletr}),
    ('Teclado Mecânico', 299.90, ${idEletr}),
    ('Headset Gamer', 199.90, ${idEletr}),

    -- Roupas
    ('Camiseta Básica', 49.90, ${idRoupas}),
    ('Calça Jeans', 129.90, ${idRoupas}),
    ('Jaqueta Masculina', 249.90, ${idRoupas}),
    ('Vestido Floral', 159.90, ${idRoupas}),
    ('Moletom Unissex', 139.90, ${idRoupas}),
    ('Bermuda Esportiva', 79.90, ${idRoupas}),

    -- Casa e Decoração
    ('Luminária LED', 119.90, ${idCasa}),
    ('Mesa de Centro', 399.90, ${idCasa}),
    ('Tapete Decorativo', 149.90, ${idCasa}),
    ('Almofada Decorativa', 39.90, ${idCasa}),
    ('Estante Organizadora', 289.90, ${idCasa}),
    ('Relógio de Parede', 69.90, ${idCasa}),

    -- Esportes
    ('Bola de Futebol', 79.90, ${idEsportes}),
    ('Tênis Running', 299.90, ${idEsportes}),
    ('Luva de Academia', 59.90, ${idEsportes}),
    ('Garrafa Térmica', 49.90, ${idEsportes}),
    ('Corda de Pular', 29.90, ${idEsportes}),
    ('Colchonete Fitness', 89.90, ${idEsportes}),

    -- Livros
    ('Clean Code', 89.90, ${idLivros}),
    ('JavaScript Definitivo', 129.90, ${idLivros}),
    ('Arquitetura Limpa', 99.90, ${idLivros}),
    ('Node.js na Prática', 79.90, ${idLivros}),
    ('React para Iniciantes', 69.90, ${idLivros}),
    ('Algoritmos e Estruturas de Dados', 149.90, ${idLivros});
  `);

      console.log("30 produtos inseridos com sucesso!");
    } else {
      console.log("O banco já possui dados, pulando a inserção.");
    }
  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err);
  } finally {
    await client.end(); // 👈 Fecha a conexão de forma segura no final de tudo
  }
}

inicializarBanco();

export default app;
