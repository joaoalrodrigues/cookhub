export interface User {
  id: string;
  username: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  parent_recipe_id: string | null;
  title: string;
  version_number: number;
}

export interface BakeSession {
  id: string;
  recipe_id: string;
  user_id: string;
  notes: string;
  rating: number;
  baked_at: string;
}

export interface RecipeFormData {
  title: string;
  ingredients: string;
  instructions: string;
  prep_time: number;
  cook_time: number;
  yield_quantity: number;
  yield_unit: string;
  effort_level: 'Fácil' | 'Médio' | 'Desafiador';
  cost: '$' | '$$' | '$$$';
}

export interface NewBakeSession {
  recipe_id: string;
  user_id: string;
  notes: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  stats: {
    recipes_created: number;
    bake_sessions: number;
    hours_cooked: number;
  };
}

export interface ProfileRecipe {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export interface DraftRecipe {
  id: string;
  title: string;
  missing_fields: string[];
  last_edited: string;
}

export interface CommunityRecipe {
  id: string;
  title: string;
  author: string;
  total_time: number;
  effort_level: 'Fácil' | 'Médio' | 'Desafiador';
  cost: '$' | '$$' | '$$$';
  image_url: string;
}
