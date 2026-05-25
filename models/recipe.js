import database from "../infra/database.js";

/**
 * Cria uma nova receita.
 * @param {Object} data - Dados da receita.
 * @returns {Promise<Object>} A receita inserida.
 */
export async function createRecipe(data) {
  try {
    const query = {
      text: `
        INSERT INTO recipes (
          author_id, 
          title, 
          description, 
          total_time, 
          effort_level, 
          cost, 
          yield, 
          image_url, 
          ingredients, 
          instructions
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *;
      `,
      values: [
        data.author_id,
        data.title,
        data.description,
        data.total_time,
        data.effort_level,
        data.cost,
        data.yield,
        data.image_url,
        JSON.stringify(data.ingredients || []),
        JSON.stringify(data.instructions || []),
      ],
    };

    const result = await database.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Erro no model createRecipe:", error);
    throw new Error("Não foi possível criar a receita.");
  }
}

/**
 * Adiciona uma nota contextual (Caderno Vivo) a uma âncora de receita (ingrediente ou passo).
 * @param {Object} data - Dados da nota.
 * @returns {Promise<Object>} A nota inserida.
 */
export async function addContextualNote(data) {
  try {
    const query = {
      text: `
        INSERT INTO recipe_notes (
          recipe_id, 
          user_id, 
          anchor_id, 
          content
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `,
      values: [
        data.recipe_id,
        data.user_id,
        data.anchor_id,
        data.content,
      ],
    };

    const result = await database.query(query);
    return result.rows[0];
  } catch (error) {
    console.error("Erro no model addContextualNote:", error);
    throw new Error("Não foi possível adicionar a nota contextual.");
  }
}

/**
 * Obtém uma receita completa, já mesclando todas as suas notas contextuais agrupadas por anchor_id.
 * @param {string} recipeId - UUID da receita.
 * @returns {Promise<Object>} A receita com o campo "notes".
 */
export async function getRecipeWithNotes(recipeId) {
  try {
    const query = {
      text: `
        SELECT 
          r.id, 
          r.author_id, 
          r.title, 
          r.description, 
          r.total_time, 
          r.effort_level, 
          r.cost, 
          r.yield, 
          r.image_url, 
          r.ingredients, 
          r.instructions, 
          r.created_at, 
          r.updated_at,
          COALESCE(
            (
              SELECT json_object_agg(sub.anchor_id, sub.notes_list)
              FROM (
                SELECT 
                  anchor_id, 
                  json_agg(
                    json_build_object(
                      'id', id,
                      'user_id', user_id,
                      'content', content,
                      'created_at', created_at
                    ) ORDER BY created_at ASC
                  ) as notes_list
                FROM recipe_notes
                WHERE recipe_id = r.id
                GROUP BY anchor_id
              ) sub
            ),
            '{}'::json
          ) as notes
        FROM recipes r
        WHERE r.id = $1;
      `,
      values: [recipeId],
    };

    const result = await database.query(query);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Erro no model getRecipeWithNotes:", error);
    throw new Error("Não foi possível buscar a receita e suas notas.");
  }
}

/**
 * Obtém todas as receitas cadastradas.
 * @returns {Promise<Array>} Lista de receitas.
 */
export async function getAllRecipes() {
  try {
    const query = {
      text: `
        SELECT 
          id, 
          author_id, 
          title, 
          description, 
          total_time, 
          effort_level, 
          cost, 
          yield, 
          image_url, 
          created_at, 
          updated_at
        FROM recipes
        ORDER BY created_at DESC;
      `,
    };

    const result = await database.query(query);
    return result.rows;
  } catch (error) {
    console.error("Erro no model getAllRecipes:", error);
    throw new Error("Não foi possível buscar as receitas.");
  }
}

export default {
  createRecipe,
  addContextualNote,
  getRecipeWithNotes,
  getAllRecipes,
};
