import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Book, 
  ChefHat, 
  Clock, 
  Award, 
  ChevronRight,
  Heart,
  Edit3
} from "lucide-react";
import { UserProfile, ProfileRecipe } from "../types";

const MOCK_PROFILE: UserProfile = {
  id: "u1",
  username: "Gabriel Padeiro",
  avatar_url: "https://images.unsplash.com/photo-1583394838336-acd977730f90?w=400&h=400&fit=crop",
  bio: "Entusiasta da fermentação natural e fã incondicional de pães rústicos. Compartilhando minha jornada entre farinha e água.",
  stats: {
    recipes_created: 15,
    bake_sessions: 42,
    hours_cooked: 30
  }
};

const MOCK_CREATIONS: ProfileRecipe[] = [
  { id: "c1", title: "Pão de Campanha Rústico", category: "Fermentação Natural", image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop" },
  { id: "c2", title: "Baguete de Tradição", category: "Clássicos", image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop" },
  { id: "c3", title: "Focaccia de Alecrim", category: "Italiana", image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop" },
  { id: "c4", title: "Pão de Nozes e Mel", category: "Grãos", image_url: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=600&h=400&fit=crop" },
];

const MOCK_ADAPTATIONS: ProfileRecipe[] = [
  { id: "a1", title: "Brioche de Canela (Adaptação)", category: "Viennoiserie", image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&h=400&fit=crop" },
  { id: "a2", title: "Pão de Queijo Mineiro", category: "Brasileira", image_url: "https://images.unsplash.com/photo-1598143158330-482bc605634b?w=600&h=400&fit=crop" },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'creations' | 'adaptations'>('creations');

  const recipes = activeTab === 'creations' ? MOCK_CREATIONS : MOCK_ADAPTATIONS;

  return (
    <div className="space-y-12 pb-20">
      {/* User Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[40px] shadow-sm border border-[#E2D6C0]"
      >
        <div className="relative group">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#FDFCF8] shadow-xl">
            <img src={MOCK_PROFILE.avatar_url} alt={MOCK_PROFILE.username} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-2 right-2 bg-[#5A5A40] text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Edit3 size={16} />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2115]">{MOCK_PROFILE.username}</h2>
            <p className="text-[#5A5A40] text-sm font-sans uppercase tracking-[0.2em] mt-1 font-bold">Mestre Padeiro</p>
          </div>
          <p className="text-[#2C2115]/70 max-w-xl leading-relaxed italic">{MOCK_PROFILE.bio}</p>
          
          <div className="flex justify-center md:justify-start gap-3">
            <button className="bg-[#5A5A40] text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#4A4A30] transition-colors">Seguir</button>
            <button className="border border-[#E2D6C0] text-[#5A5A40] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#FDFCF8] transition-colors font-sans">Mensagem</button>
          </div>
        </div>
      </motion.section>

      {/* Stats Panel */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div className="bg-[#FDFCF8] border border-[#E2D6C0] p-6 rounded-3xl flex items-center justify-between group hover:border-[#5A5A40] transition-colors">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-40 mb-1">Receitas Criadas</p>
            <p className="text-3xl font-serif">{MOCK_PROFILE.stats.recipes_created}</p>
          </div>
          <Book size={24} className="opacity-20 group-hover:opacity-100 transition-opacity text-[#5A5A40]" />
        </div>
        <div className="bg-[#FDFCF8] border border-[#E2D6C0] p-6 rounded-3xl flex items-center justify-between group hover:border-[#5A5A40] transition-colors">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-40 mb-1">Fornadas</p>
            <p className="text-3xl font-serif">{MOCK_PROFILE.stats.bake_sessions}</p>
          </div>
          <ChefHat size={24} className="opacity-20 group-hover:opacity-100 transition-opacity text-[#5A5A40]" />
        </div>
        <div className="bg-[#FDFCF8] border border-[#E2D6C0] p-6 rounded-3xl flex items-center justify-between group hover:border-[#5A5A40] transition-colors col-span-2 md:col-span-1">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold opacity-40 mb-1">Horas na Cozinha</p>
            <p className="text-3xl font-serif">{MOCK_PROFILE.stats.hours_cooked}h</p>
          </div>
          <Clock size={24} className="opacity-20 group-hover:opacity-100 transition-opacity text-[#5A5A40]" />
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <div className="space-y-8">
        <div className="flex border-b border-[#E2D6C0] gap-12 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('creations')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'creations' ? 'text-[#5A5A40]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Minhas Criações
            {activeTab === 'creations' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('adaptations')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'adaptations' ? 'text-[#5A5A40]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Minhas Adaptações
            {activeTab === 'adaptations' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />
            )}
          </button>
        </div>

        {/* Recipe Grid (The Bookshelf) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {recipes.map((recipe, idx) => (
              <motion.div 
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="group relative bg-[#FDFCF8] rounded-[32px] overflow-hidden border border-[#E2D6C0] hover:shadow-xl transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C2115]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#5A5A40] opacity-50 bg-[#5A5A40]/5 px-2 py-1 rounded-md">{recipe.category}</span>
                    <button className="text-[#5A5A40] hover:opacity-100 opacity-30 transition-opacity">
                      <Heart size={20} />
                    </button>
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[#2C2115] leading-tight group-hover:text-[#5A5A40] transition-colors">{recipe.title}</h4>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[#E2D6C0]/50">
                    <div className="flex items-center gap-4 text-xs font-sans opacity-40 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1"><Award size={14} /> 4.9</span>
                        <span className="flex items-center gap-1"><ChefHat size={14} /> Médio</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#E2D6C0]/30 flex items-center justify-center hover:bg-[#5A5A40] hover:text-white transition-all transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
