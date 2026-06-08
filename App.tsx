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
import FloatingTimer from "./components/FloatingTimer";
import DiaryForm from "./components/DiaryForm";
import DiaryHistory from "./components/DiaryHistory";

export default function App() {
  const [activeTab, setActiveTab] = useState<'bakes' | 'recipes' | 'profile' | 'dashboard' | 'explore' | 'recipe_view' | 'diary_form'>('dashboard');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isTimerVisible, setIsTimerVisible] = useState(false);

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
      
      if (usersRes.ok && usersRes.headers.get("content-type")?.includes("application/json") &&
          recipesRes.ok && recipesRes.headers.get("content-type")?.includes("application/json")) {
        const usersData = await usersRes.json();
        const recipesData = await recipesRes.json();
        setUsers(usersData);
        setRecipes(recipesData);
      } else {
        console.log("Using mock data");
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
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shrink-0">
              <ChefHat size={22} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CookHub</h1>
          </button>
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
            onCreateRecipe={() => { setSelectedRecipeId(null); setActiveTab('recipes'); }} 
            onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }}
            onEditRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipes'); }}
            onOpenTimers={() => setIsTimerVisible(true)}
          />
        ) : activeTab === 'recipes' ? (
          <RecipeForm recipeId={selectedRecipeId} onBack={() => setActiveTab('dashboard')} />
        ) : activeTab === 'explore' ? (
          <Explore onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }} />
        ) : activeTab === 'recipe_view' && selectedRecipeId ? (
          <RecipeViewer recipeId={selectedRecipeId} onBack={() => setActiveTab('explore')} />
        ) : activeTab === 'profile' ? (
          <Profile onOpenRecipe={(id) => { setSelectedRecipeId(id); setActiveTab('recipe_view'); }} />
        ) : activeTab === 'diary_form' ? (
          <DiaryForm />
        ) : (
          <DiaryHistory onNewRecord={() => setActiveTab('diary_form')} />
        )}
      </main>

      <footer className="mt-20 border-t border-[#E2D6C0] py-8 text-center text-xs opacity-40 uppercase tracking-widest font-bold font-sans">
        CookHub &copy; {new Date().getFullYear()} • De Chef para Chef
      </footer>

      {isTimerVisible && <FloatingTimer onClose={() => setIsTimerVisible(false)} />}
    </div>
  );
}
