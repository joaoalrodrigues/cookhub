import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, ChevronLeft, ChevronRight, Filter, ChevronDown, Image as ImageIcon } from "lucide-react";

interface DiaryEntry {
  id: string;
  recipeName: string;
  date: string;
  notes: string;
  flavorRes: string;
  textureRes: string;
  imageUrl?: string;
}

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: "e1",
    recipeName: "Pão de Centeio e Mel",
    date: "12 de Out, 2023",
    notes: "A massa estava um pouco seca no começo, adicionei 20ml de água extra. O sabor do mel ficou bem sutil, muito bom para acompanhar manteiga.",
    flavorRes: "Bom",
    textureRes: "Precisa de ajustes",
  },
  {
    id: "e2",
    recipeName: "Risotto de Cogumelos",
    date: "05 de Out, 2023",
    notes: "Utilizei caldo de legumes caseiro. O tempo de cozimento do arroz foi exato aos 18 minutos. O truque de adicionar a manteiga gelada no final fez toda a diferença na cremosidade.",
    flavorRes: "Surpreendente",
    textureRes: "No ponto",
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&auto=format&fit=crop"
  },
  {
    id: "e3",
    recipeName: "Bolo de Cenoura",
    date: "28 de Set, 2023",
    notes: "Assei por 45 minutos em vez de 40 devido ao forno desregulado. A cobertura de chocolate ficou um pouco dura, da próxima vez coloco mais creme de leite.",
    flavorRes: "Bom",
    textureRes: "Passou do ponto",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop"
  },
  {
    id: "e4",
    recipeName: "Muffins de Blueberry",
    date: "15 de Set, 2023",
    notes: "Usei mirtilos congelados. A dica de passar na farinha antes evitou que afundassem na massa. Cresceram perfeitamente e a crosta de açúcar por cima deu um toque especial.",
    flavorRes: "Surpreendente",
    textureRes: "No ponto",
  }
];

interface DiaryHistoryProps {
  onNewRecord: () => void;
}

export default function DiaryHistory({ onNewRecord }: DiaryHistoryProps) {
  const [filterRecipe, setFilterRecipe] = useState("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E2D6C0]">
        <div>
          <h2 className="text-4xl font-light mb-2 font-serif text-[#2C2115]">Meu Diário</h2>
          <p className="text-[#5A5A40] italic">O histórico detalhado das suas experiências culinárias.</p>
        </div>
        <button 
          onClick={onNewRecord}
          className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-sans font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-md shrink-0 text-sm"
        >
          <Plus size={18} /> Novo Registo
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#E2D6C0]">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-[#5A5A40] opacity-60" />
          <div className="relative w-full md:w-64">
            <select 
              value={filterRecipe}
              onChange={(e) => setFilterRecipe(e.target.value)}
              className="w-full bg-white border border-[#E2D6C0] rounded-xl py-2 px-4 pr-10 text-sm font-sans font-medium text-[#2C2115] appearance-none focus:outline-none focus:border-[#5A5A40] transition-colors"
            >
              <option value="all">Mostrar todas as receitas</option>
              <option value="pao">Pão de Centeio e Mel</option>
              <option value="risotto">Risotto de Cogumelos</option>
              <option value="bolo">Bolo de Cenoura</option>
              <option value="muffin">Muffins de Blueberry</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5A40] pointer-events-none opacity-60" size={16} />
          </div>
        </div>
        <div className="text-sm font-sans text-[#5A5A40]/80">
          Ordenado por: <span className="font-bold text-[#2C2115]">Mais Recentes</span>
        </div>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ENTRIES.map((entry) => (
          <div key={entry.id} className="bg-white border border-[#E2D6C0] rounded-[24px] overflow-hidden flex flex-col hover:border-[#5A5A40]/40 transition-colors shadow-sm">
            {entry.imageUrl ? (
              <div className="h-48 overflow-hidden relative">
                <img src={entry.imageUrl} alt={entry.recipeName} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
              </div>
            ) : (
                <div className="h-48 bg-[#FDFCF8] flex items-center justify-center border-b border-[#E2D6C0]">
                    <ImageIcon size={32} className="text-[#5A5A40]/20" />
                </div>
            )}
            
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest font-bold text-[#5A5A40]/60 mb-1">{entry.date}</div>
                <h3 className="text-xl font-serif font-bold text-[#2C2115] leading-tight">{entry.recipeName}</h3>
              </div>
              
              <p className="text-sm text-[#2C2115]/80 leading-relaxed font-serif mb-6 flex-1 line-clamp-3">
                "{entry.notes}"
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#E2D6C0]/30 text-[#5A5A40]">
                  Sabor: {entry.flavorRes}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#E2D6C0]/30 text-[#5A5A40]">
                  Textura: {entry.textureRes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#E2D6C0]">
        <button className="p-2 rounded-full hover:bg-[#FDFCF8] text-[#5A5A40] transition-colors" disabled>
          <ChevronLeft size={20} />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center text-sm font-bold shadow-sm">
          1
        </button>
        <button className="w-10 h-10 rounded-full hover:bg-[#FDFCF8] text-[#5A5A40] flex items-center justify-center text-sm font-bold transition-colors">
          2
        </button>
        <button className="w-10 h-10 rounded-full hover:bg-[#FDFCF8] text-[#5A5A40] flex items-center justify-center text-sm font-bold transition-colors">
          3
        </button>
        <button className="p-2 rounded-full hover:bg-[#FDFCF8] text-[#5A5A40] transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
