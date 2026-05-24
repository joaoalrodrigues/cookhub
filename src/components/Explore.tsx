import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Flame, 
  Sparkles, 
  Clock, 
  Trophy, 
  DollarSign, 
  User as UserIcon,
  Filter
} from "lucide-react";
import { CommunityRecipe } from "../types";

const MOCK_RECIPES: CommunityRecipe[] = [
  { 
    id: "e1", 
    title: "Pão de Forma Integral de Mel", 
    author: "Alice Ferreira", 
    total_time: 150, 
    effort_level: "Médio", 
    cost: "$", 
    image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&h=350&fit=crop" 
  },
  { 
    id: "e2", 
    title: "Pizza Napolitana", 
    author: "Marco Rossi", 
    total_time: 480, 
    effort_level: "Desafiador", 
    cost: "$$", 
    image_url: "https://images.unsplash.com/photo-1574129624952-329cc250917e?w=500&h=350&fit=crop" 
  },
  { 
    id: "e3", 
    title: "Cookies de Aveia e Passas", 
    author: "Júlia Mendes", 
    total_time: 30, 
    effort_level: "Fácil", 
    cost: "$", 
    image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=350&fit=crop" 
  },
  { 
    id: "e4", 
    title: "Brioche de Chocolate", 
    author: "Lucas Porto", 
    total_time: 240, 
    effort_level: "Médio", 
    cost: "$$$", 
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=350&fit=crop" 
  }
];

export default function Explore({ onOpenRecipe }: { onOpenRecipe?: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'trending' | 'recent' | 'results'>('trending');

  // Logic: When typing, switch to results
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setActiveTab('results');
    } else if (activeTab === 'results') {
      setActiveTab('trending');
    }
  }, [searchQuery]);

  const filteredRecipes = MOCK_RECIPES.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Search Header */}
      <div className="relative">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-[#5A5A40] opacity-40">
          <Search size={22} />
        </div>
        <input 
          type="text"
          placeholder="Procure por pães, bolos, técnicas ou autores..."
          className="w-full bg-white border border-[#E2D6C0] rounded-[32px] pl-16 pr-8 py-5 text-lg font-serif shadow-sm focus:outline-none focus:ring-4 focus:ring-[#5A5A40]/5 transition-all placeholder:text-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-[#FDFCF8] rounded-full transition-colors text-[#5A5A40] opacity-40">
          <Filter size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#FDFCF8] p-1.5 rounded-2xl border border-[#E2D6C0] w-full md:w-auto md:self-start overflow-x-auto no-scrollbar">
        {(['trending', 'recent', 'results'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all relative shrink-0 whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#5A5A40] text-white shadow-md' 
                : 'text-[#5A5A40]/40 hover:text-[#5A5A40]'
            }`}
          >
            {tab === 'trending' && <span className="flex items-center gap-2"><Flame size={14} /> Em Alta</span>}
            {tab === 'recent' && <span className="flex items-center gap-2"><Sparkles size={14} /> Mais Recentes</span>}
            {tab === 'results' && <span>Resultados</span>}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, idx) => (
              <motion.div 
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => onOpenRecipe && onOpenRecipe(recipe.id)}
                className="group bg-white rounded-[32px] overflow-hidden border border-[#E2D6C0] hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#5A5A40] uppercase shadow-sm">
                    {recipe.cost}
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#5A5A40] opacity-40">
                    <UserIcon size={12} /> {recipe.author}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[#2C2115] leading-tight group-hover:text-[#5A5A40] transition-colors">{recipe.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#E2D6C0]/50 text-[10px] font-sans opacity-60 uppercase tracking-widest font-bold">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {recipe.total_time} min</span>
                      <span className="flex items-center gap-1.5"><Trophy size={12} /> {recipe.effort_level}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-[#FDFCF8] border border-[#E2D6C0] rounded-full flex items-center justify-center mx-auto text-[#5A5A40] opacity-20">
                <Search size={32} />
              </div>
              <p className="text-[#5A5A40] font-serif italic text-lg">Nenhuma receita encontrada para sua busca.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
