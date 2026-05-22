import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";
import { z } from "zod";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Database configuration
// Using a pool for better performance and connection management
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opcional: Permite configurar via variáveis individuais se DATABASE_URL não for fornecido
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // Se estiveres a usar um provedor cloud como Supabase ou Render, 
  // podes precisar de SSL: { rejectUnauthorized: false }
});

// Test connection on startup (as recommended for robust apps)
if (process.env.DATABASE_URL || process.env.POSTGRES_HOST) {
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      console.warn("⚠️ Conexão ao banco de dados falhou. Verifique seu DATABASE_URL ou variáveis POSTGRES no painel Secrets.");
      console.error(err.message);
    } else {
      console.log("✅ Banco de dados conectado com sucesso.");
    }
  });
} else {
  console.warn("ℹ️ Nenhuma configuração de banco de dados detectada. Por favor, configure o DATABASE_URL nos Secrets para registrar fornadas.");
}

app.use(cors());
app.use(express.json());

// --- MOCK DATA FOR PREVIEW ---
const MOCK_USERS = [
  { id: "00000000-0000-0000-0000-000000000001", username: "Padeiro_Chef" },
  { id: "00000000-0000-0000-0000-000000000002", username: "Dona_Benta" },
  { id: "00000000-0000-0000-0000-000000000003", username: "Maria_Culinaria" }
];

const MOCK_RECIPES = [
  { id: "10000000-0000-0000-0000-000000000001", title: "Pão de Fermentação Natural", user_id: MOCK_USERS[0].id, version_number: 1 },
  { id: "10000000-0000-0000-0000-000000000002", title: "Baguete Francesa Tradicional", user_id: MOCK_USERS[1].id, version_number: 2 },
  { id: "10000000-0000-0000-0000-000000000003", title: "Bolo de Cenoura com Cobertura", user_id: MOCK_USERS[2].id, version_number: 1 }
];

// --- API ROUTES ---

/**
 * @route GET /api/users
 * @desc Get all users (with mock fallback)
 */
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    if (result.rows.length === 0 && process.env.NODE_ENV !== "production") {
      return res.json(MOCK_USERS);
    }
    res.json(result.rows);
  } catch (error) {
    console.warn("DB connection failed, falling back to mock users.");
    res.json(MOCK_USERS);
  }
});

/**
 * @route GET /api/recipes
 * @desc Get all recipes (with mock fallback)
 */
app.get("/api/recipes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipes;");
    if (result.rows.length === 0 && process.env.NODE_ENV !== "production") {
      return res.json(MOCK_RECIPES);
    }
    res.json(result.rows);
  } catch (error) {
    console.warn("DB connection failed, falling back to mock recipes.");
    res.json(MOCK_RECIPES);
  }
});

/**
 * @route POST /api/bakes
 * @desc Register a new bake session
 */
const bakeSchema = z.object({
  recipe_id: z.string().uuid({ message: "recipe_id must be a valid UUID" }),
  user_id: z.string().uuid({ message: "user_id must be a valid UUID" }),
  notes: z.string().min(1, { message: "Notes cannot be empty" }),
  rating: z.number().int().min(1).max(5, { message: "Rating must be between 1 and 5" }),
});

app.post("/api/bakes", async (req, res) => {
  try {
    // 1. Validação de Dados
    const validation = bakeSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: "Falha na validação",
        details: validation.error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const { recipe_id, user_id, notes, rating } = validation.data;

    // 2. Conexão com o Banco de Dados e Inserção
    try {
      const query = `
        INSERT INTO bake_sessions (recipe_id, user_id, notes, rating)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [recipe_id, user_id, notes, rating];

      const result = await pool.query(query, values);

      // 3. Sucesso: Devolve status code 201 e o objeto JSON
      res.status(201).json(result.rows[0]);
    } catch (dbError: any) {
      // Fallback for mock mode during development
      if (process.env.NODE_ENV !== "production") {
        console.warn("DB action failed, simulating success in mock mode.");
        return res.status(201).json({
          id: crypto.randomUUID ? crypto.randomUUID() : "mock-id-" + Date.now(),
          recipe_id,
          user_id,
          notes,
          rating,
          baked_at: new Date().toISOString()
        });
      }
      throw dbError; // Rethrow to be caught by the outer catch
    }

  } catch (error: any) {
    // 4. Tratamento de Erros
    console.error("Erro no banco ao registrar fornada:", error);

    // Specific handling for foreign key violations (user or recipe not found)
    if (error.code === '23503') {
      return res.status(400).json({
        error: "Erro de integridade referencial",
        message: "O user_id ou recipe_id fornecido não existe.",
        detail: error.detail
      });
    }

    // Generic fallback for other 500 errors
    res.status(500).json({
      error: "Erro Interno do Servidor",
      message: "Ocorreu um erro inesperado ao processar sua solicitação."
    });
  }
});

// --- VITE MIDDLEWARE ---

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 CookHub server running on http://localhost:${PORT}`);
  });
}

setupVite();
