import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface Technique {
  id: string;
  title: string;
  content: string;
}

const MOCK_TECHNIQUES: Technique[] = [
  {
    id: "t1",
    title: "Cálculo de Hidratação",
    content: "A hidratação é a razão entre o peso da água e o peso da farinha, expressa em percentagem (Fórmula do Padeiro). Exemplo: 500g de farinha e 350g de água = (350 / 500) * 100 = 70% de hidratação. Massas com maior hidratação resultam num miolo mais aberto."
  },
  {
    id: "t2",
    title: "Temperaturas do Açúcar",
    content: "Fio (105°C): Fina camada para frutas caramelizadas.\nBala Mole (115°C): Perfeito para fondants e fudge.\nCaramelo Claro (160°C): Base para nougat e praliné.\nCaramelo Escuro (175°C): Coloração âmbar profunda, ideal para caldas ricas."
  },
  {
    id: "t3",
    title: "Fases da Autólise",
    content: "Misture a farinha e a água (sem sal ou fermento) e deixe repousar por 20 a 60 minutos. A hidratação prévia permite que as enzimas quebrem amidos e proteínas, resultando em maior extensibilidade e menos tempo de sova mecânica."
  },
  {
    id: "t4",
    title: "Temperagem de Chocolate",
    content: "O objetivo é cristalizar a manteiga de cacau corretamente. Derreta a 45°C, resfrie a 27°C (seeding ou marmore) e reaqueça suavemente até a temperatura de trabalho (31-32°C para o amargo)."
  }
];

interface TechniquesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TechniquesDrawer({ isOpen, onClose }: TechniquesDrawerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm md:w-96 z-50 bg-[#FDFCF8] shadow-2xl flex flex-col border-l border-[#E2D6C0]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E2D6C0] bg-white">
              <div className="flex items-center gap-3 text-[#2C2115]">
                <BookOpen size={24} className="opacity-80" />
                <h2 className="font-serif text-xl font-bold">Fichas Técnicas</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-[#5A5A40]/50 hover:text-[#2C2115] transition-colors p-2 rounded-full hover:bg-neutral-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              <p className="text-xs uppercase tracking-widest font-bold opacity-40 text-[#2C2115] mb-6">Guia de Referência Rápida</p>
              
              {MOCK_TECHNIQUES.map(technique => {
                const isExpanded = expandedId === technique.id;
                
                return (
                  <div 
                    key={technique.id}
                    className="bg-white border border-[#E2D6C0] rounded-2xl overflow-hidden transition-colors hover:border-[#5A5A40]/40 shadow-sm"
                  >
                    <button 
                      onClick={() => toggleExpand(technique.id)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <span className="font-serif font-bold text-[#2C2115] text-lg pr-4">{technique.title}</span>
                      <div className="text-[#5A5A40] opacity-60 flex-shrink-0">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-[#2C2115]/80 text-sm leading-relaxed border-t border-[#E2D6C0]/50 mt-2">
                             {technique.content.split('\n').map((line, i) => (
                               <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                             ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
