/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChefHat, 
  Utensils, 
  Star, 
  Plus, 
  Calendar, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Hash
} from "lucide-react";
import { User, Recipe, BakeSession, NewBakeSession } from "./types";
import RecipeForm from "./components/RecipeForm";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Explore from "./components/Explore";
import RecipeViewer from "./components/RecipeViewer";

export default function App() {
  const [activeTab, setActiveTab] = useState<'bakes' | 'recipes' | 'profile' | 'dashboard' | 'explore' | 'recipe_view'>('dashboard');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [formData, setFormData] = useState<NewBakeSession>({
    recipe_id: "",
    user_id: "",
    notes: "",
    rating: 5
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, recipesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/recipes")
      ]);
      
      if (usersRes.ok && recipesRes.ok) {
        const usersData = await usersRes.json();
        const recipesData = await recipesRes.json();
        setUsers(usersData);
        setRecipes(recipesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/bakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: "Fornada registrada com sucesso! Ótimo trabalho." });
        setFormData({ ...formData, notes: "", rating: 5 });
      } else {
        setStatus({ 
          type: 'error', 
          message: result.message || result.error || "Ocorreu um erro ao registrar a fornada." 
        });
      }
    } catch (error) {
      setStatus({ type: 'error', message: "Erro de conexão com o servidor." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2C2115] font-serif selection:bg-[#E2D6C0]">
      {/* Header */}
      <header className="border-b border-[#E2D6C0] bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-0 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shrink-0">
              <ChefHat size={22} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CookHub</h1>
          </div>
          <div className="flex w-full md:w-auto overflow-x-auto no-scrollbar gap-1 text-sm font-sans uppercase tracking-[0.2em] font-bold items-center bg-[#FDFCF8] p-1 rounded-2xl border border-[#E2D6C0]">
            {[
              { id: 'dashboard', label: 'Bancada' },
              { id: 'explore', label: 'Explorar' },
              { id: 'bakes', label: 'Diário' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 text-[10px] whitespace-nowrap shrink-0 ${
                  activeTab === item.id 
                    ? 'bg-[#5A5A40] text-white shadow-sm' 
                    : 'text-[#5A5A40]/40 hover:text-[#5A5A40] hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="hidden sm:block w-px h-4 bg-[#E2D6C0] mx-1 md:mx-2 shrink-0" />
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-[10px] whitespace-nowrap shrink-0 ${
                activeTab === 'profile' 
                  ? 'bg-[#5A5A40] text-white shadow-sm' 
                  : 'text-[#5A5A40]/40 hover:text-[#5A5A40] hover:bg-black/5'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-current opacity-80 shrink-0">
                <img src="https://images.unsplash.com/photo-1583394838336-acd977730f90?w=100&h=100&fit=crop" alt="Perfil" className="w-full h-full object-cover" />
              </div>
              <span>Perfil</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {activeTab === 'dashboard' ? (
          <Dashboard 
            onCreateRecipe={() => setActiveTab('recipes')} 
            onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }}
          />
        ) : activeTab === 'recipes' ? (
          <RecipeForm />
        ) : activeTab === 'explore' ? (
          <Explore onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }} />
        ) : activeTab === 'recipe_view' && selectedRecipeId ? (
          <RecipeViewer recipeId={selectedRecipeId} onBack={() => setActiveTab('explore')} />
        ) : activeTab === 'profile' ? (
          <Profile onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }} />
        ) : (
          <div className="grid md:grid-cols-[1fr_340px] gap-12">
            {/* Main Form Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-light mb-3">Diário de Fornada</h2>
                <p className="text-[#5A5A40] italic">Compartilhe o que deu certo (ou errado) na sua última aventura culinária.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[32px] shadow-sm border border-[#E2D6C0]">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                      <Utensils size={14} /> Receita
                    </label>
                    <select 
                      required
                      className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all appearance-none"
                      value={formData.recipe_id}
                      onChange={(e) => setFormData({ ...formData, recipe_id: e.target.value })}
                    >
                      <option value="">Selecionar Receita...</option>
                      {recipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                      <ChefHat size={14} /> Padeiro / Cozinheiro
                    </label>
                    <select 
                      required
                      className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all appearance-none"
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    >
                      <option value="">Quem é você?</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                    <MessageSquare size={14} /> Notas da Fornada
                  </label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Ex: A massa estava muito seca, adicionei mais 20ml de água. O forno estava um pouco mais quente que o normal..."
                    className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
                    <Star size={14} /> Pontuação (1 a 5)
                  </label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                          formData.rating === num 
                            ? 'bg-[#5A5A40] text-white scale-110 shadow-lg' 
                            : 'bg-[#FDFCF8] border border-[#E2D6C0] hover:border-[#5A5A40]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {status && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                        status.type === 'success' 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}
                    >
                      {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Registrar Fornada
                    </>
                  )}
                </button>
              </form>
            </motion.section>

            {/* Sidebar Info */}
            <aside className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-[#E2D6C0]/20 p-6 rounded-3xl border border-[#E2D6C0]"
              >
                <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <Hash size={18} className="opacity-40" /> Status do Banco
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${recipes.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm opacity-80">{recipes.length} Receitas carregadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${users.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm opacity-80">{users.length} Usuários carregados</span>
                  </div>
                  {!loading && recipes.length === 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      <p className="font-bold mb-1">Atenção:</p>
                      <p>O banco de dados parece estar vazio ou não conectado. Verifique se você executou o script SQL e configurou o <strong>DATABASE_URL</strong>.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-xs uppercase tracking-widest font-bold opacity-60">Dicas Pro</h3>
                <ul className="space-y-3 text-sm opacity-80 italic">
                  <li className="flex gap-2"><span>•</span> Anote sempre a temperatura ambiente.</li>
                  <li className="flex gap-2"><span>•</span> A hidratação da farinha varia conforme a marca.</li>
                  <li className="flex gap-2"><span>•</span> O tempo de descanso é tão importante quanto o de forno.</li>
                </ul>
              </motion.div>
            </aside>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-[#E2D6C0] py-8 text-center text-xs opacity-40 uppercase tracking-widest font-bold font-sans">
        CookHub &copy; {new Date().getFullYear()} • De Chefs para Chefs
      </footer>
    </div>
  );
}
