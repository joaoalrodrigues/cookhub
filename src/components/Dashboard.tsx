import * as React from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  ArrowRight, 
  Clock, 
  Trophy, 
  DollarSign, 
  User as UserIcon,
  BookOpen,
  Sparkles,
  ChefHat
} from "lucide-react";
import { DraftRecipe, CommunityRecipe } from "../types";

const MOCK_DRAFTS: DraftRecipe[] = [
  { id: "d1", title: "Pão de Centeio e Mel", missing_fields: ["Instruções", "Rendimento"], last_edited: "há 2 horas" },
  { id: "d2", title: "Cookie de Chocolate Amargo", missing_fields: ["Custo"], last_edited: "ontem" }
];

const MOCK_COMMUNITY: CommunityRecipe[] = [
  { 
    id: "c1", 
    title: "Ciabatta de Longa Fermentação", 
    author: "Ana Silva", 
    total_time: 1200, 
    effort_level: "Desafiador", 
    cost: "$$", 
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop" 
  },
  { 
    id: "c2", 
    title: "Muffins de Blueberry", 
    author: "Ricardo M.", 
    total_time: 45, 
    effort_level: "Fácil", 
    cost: "$", 
    image_url: "https://images.unsplash.com/photo-1607954593931-158a436279f8?w=400&h=300&fit=crop" 
  },
  { 
    id: "c3", 
    title: "Torta de Maçã Invertida", 
    author: "Clara Luz", 
    total_time: 90, 
    effort_level: "Médio", 
    cost: "$$$", 
    image_url: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop" 
  }
];

interface DashboardProps {
  onCreateRecipe: () => void;
  onOpenRecipe?: (id: string) => void;
}

export default function Dashboard({ onCreateRecipe, onOpenRecipe }: DashboardProps) {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero / CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-[#5A5A40] rounded-[40px] p-10 md:p-16 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 transition-all"
      >
        <div className="relative z-10 space-y-6 max-w-lg mx-auto md:mx-0">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} /> Inspirado Hoje
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">O que vamos fazer hoje, Chef?</h2>
          <p className="text-white/70 text-lg italic">Cada receita é um rascunho de uma lembrança perfeita.</p>
          <button 
            onClick={onCreateRecipe}
            className="w-full sm:w-auto bg-white text-[#5A5A40] px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold uppercase tracking-widest hover:bg-[#FDFCF8] hover:scale-105 transition-all shadow-xl shadow-black/20 mx-auto md:mx-0"
          >
            <Plus size={20} /> Criar Nova Receita
          </button>
        </div>
        
        <div className="relative md:block hidden">
           <motion.div 
             initial={{ rotate: 10, scale: 0.8, opacity: 0 }}
             animate={{ rotate: 0, scale: 1, opacity: 1 }}
             transition={{ delay: 0.4, type: "spring" }}
             className="w-64 h-64 bg-white/10 rounded-[32px] backdrop-blur-md border border-white/20 rotate-6 flex items-center justify-center"
           >
              <ChefHat size={120} className="text-white/20" />
           </motion.div>
           <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-[#5A5A40] rotate-12">
             <Star size={24} fill="currentColor" />
           </div>
        </div>
      </motion.section>

      {/* Continue Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.3em] font-black opacity-30">Continue de onde parou</h3>
          <button className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100 flex items-center gap-1 transition-opacity">Ver todos os rascunhos <ArrowRight size={10} /></button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_DRAFTS.map((draft, idx) => (
            <motion.div 
              key={draft.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white p-6 rounded-3xl border border-[#E2D6C0] flex items-center justify-between group hover:border-[#5A5A40] transition-colors"
            >
              <div className="space-y-2">
                <h4 className="font-serif text-xl text-[#2C2115]">{draft.title}</h4>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Falta: {draft.missing_fields.join(", ")}</span>
                  <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{draft.last_edited}</span>
                </div>
              </div>
              <button className="w-12 h-12 bg-[#FDFCF8] border border-[#E2D6C0] rounded-2xl flex items-center justify-center group-hover:bg-[#5A5A40] group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="space-y-6">
        <h3 className="text-xs uppercase tracking-[0.3em] font-black opacity-30">Em Alta na Comunidade</h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COMMUNITY.map((recipe, idx) => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * idx) }}
              className="group bg-white rounded-[32px] overflow-hidden border border-[#E2D6C0] hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                   <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider shadow-sm">
                     <UserIcon size={12} /> {recipe.author}
                   </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h4 className="text-xl font-serif font-bold text-[#2C2115] leading-tight line-clamp-2 min-h-[3.5rem]">{recipe.title}</h4>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-[#E2D6C0]/50 text-[10px] font-sans opacity-60 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {recipe.total_time} min</span>
                  <span className="flex items-center gap-1.5"><Trophy size={12} /> {recipe.effort_level}</span>
                  <span className="flex items-center gap-1.5"><DollarSign size={12} /> {recipe.cost}</span>
                </div>

                <button 
                  onClick={() => onOpenRecipe && onOpenRecipe(recipe.id)}
                  className="w-full mt-4 py-3 rounded-xl border border-[#E2D6C0] text-[#5A5A40] text-[10px] uppercase font-black tracking-[0.2em] group-hover:bg-[#5A5A40] group-hover:text-white group-hover:border-transparent transition-all"
                >
                  Ver Receita
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Fichas Técnicas", color: "text-blue-500" },
          { icon: Clock, label: "Temporizadores", color: "text-orange-500" },
          { icon: Trophy, label: "Desafios", color: "text-purple-500" },
          { icon: DollarSign, label: "Calculadora de Custos", color: "text-green-500" }
        ].map((item, idx) => (
          <button key={idx} className="bg-[#FDFCF8] border border-[#E2D6C0] p-4 sm:p-6 rounded-[24px] flex flex-col items-center gap-3 hover:border-[#5A5A40] hover:bg-white transition-all group">
            <item.icon size={24} className={`${item.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity text-center leading-relaxed">{item.label}</span>
          </button>
        ))}
      </section>
    </div>
  );
}

const Star = ({ size, fill, className }: { size?: number, fill?: string, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill={fill || "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
