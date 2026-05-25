import recipeModel from "../../../../models/recipe.js";

export default async function handler(request, response) {
  const method = request.method;
  const { id } = request.query;

  if (method === "GET") {
    try {
      const recipe = await recipeModel.getRecipeWithNotes(id);
      
      if (!recipe) {
        return response.status(404).json({
          error: "Not Found",
          message: "Receita não encontrada.",
        });
      }

      return response.status(200).json(recipe);
    } catch (error) {
      console.error(`GET /api/v1/recipes/${id} error:`, error);
      return response.status(500).json({
        error: "Internal Server Error",
        message: "Não foi possível buscar a receita.",
      });
    }
  }

  return response.status(405).json({
    error: "Method Not Allowed",
    message: `Método ${method} não é permitido neste endpoint.`,
  });
}
