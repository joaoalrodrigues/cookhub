import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? true : false,
});

async function query(queryObject) {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("🗄️ Database Query Error:\n", error);
    throw error;
  } finally {
    if (client) {
      // Devolve a conexão para o Pool
      client.release();
    }
  }
}

export default { query };
