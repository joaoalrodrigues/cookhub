import recipeModel from "../../../../../models/recipe.js";
import database from "../../../../../infra/database.js";

export default async function handler(request, response) {
  const method = request.method;
  const { id: recipeId } = request.query;

  if (method === "POST") {
    try {
      const data = request.body;

      // Basic validation
      if (!data.anchor_id || !data.content) {
        return response.status(400).json({
          error: "Bad Request",
          message: "Campos obrigatórios ausentes (anchor_id, content)",
        });
      }

      let user_id = data.user_id;

      if (!user_id) {
         let userResult = await database.query("SELECT id FROM users LIMIT 1;");
         if (userResult.rows.length === 0) {
            const insertUser = await database.query("INSERT INTO users (username, email) VALUES ('Chef CookHub', 'chef@cookhub.local') RETURNING id;");
            user_id = insertUser.rows[0].id;
         } else {
            user_id = userResult.rows[0].id;
         }
      }

      const noteData = {
        recipe_id: recipeId,
        user_id: user_id,
        anchor_id: data.anchor_id,
        content: data.content,
      };

      const newNote = await recipeModel.addContextualNote(noteData);
      return response.status(201).json(newNote);
    } catch (error) {
      console.error(`POST /api/v1/recipes/${recipeId}/notes error:`, error);
      return response.status(500).json({
        error: "Internal Server Error",
        message: "Não foi possível adicionar a nota à receita.",
      });
    }
  }

  // Method Not Allowed
  return response.status(405).json({
    error: "Method Not Allowed",
    message: `Método ${method} não é permitido neste endpoint.`,
  });
}
