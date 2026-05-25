import recipeModel from "../../../../models/recipe.js";
import database from "../../../../infra/database.js";

export default async function handler(request, response) {
  const method = request.method;

  if (method === "GET") {
    try {
      const recipes = await recipeModel.getAllRecipes();
      return response.status(200).json(recipes);
    } catch (error) {
      console.error("GET /api/v1/recipes error:", error);
      return response.status(500).json({
        error: "Internal Server Error",
        message: "Não foi possível buscar as receitas.",
      });
    }
  }

  if (method === "POST") {
    try {
      const data = request.body;
      
      // Basic validation
      if (!data.title) {
        return response.status(400).json({
          error: "Bad Request",
          message: "Campos obrigatórios ausentes (title)",
        });
      }

      // Auto-create or fetch a default user to bypass FK constraint
      let author_id = data.author_id;
      if (!author_id) {
        let userResult = await database.query("SELECT id FROM users LIMIT 1;");
        if (userResult.rows.length === 0) {
           const insertUser = await database.query("INSERT INTO users (username, email) VALUES ('Chef CookHub', 'chef@cookhub.local') RETURNING id;");
           author_id = insertUser.rows[0].id;
        } else {
           author_id = userResult.rows[0].id;
        }
        data.author_id = author_id;
      }

      const newRecipe = await recipeModel.createRecipe(data);
      return response.status(201).json(newRecipe);
    } catch (error) {
      console.error("POST /api/v1/recipes error:", error);
      return response.status(500).json({
        error: "Internal Server Error",
        message: "Não foi possível cadastrar a receita.",
      });
    }
  }

  // Method Not Allowed
  return response.status(405).json({
    error: "Method Not Allowed",
    message: `Método ${method} não é permitido neste endpoint.`,
  });
}
