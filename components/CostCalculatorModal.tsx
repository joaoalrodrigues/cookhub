import * as React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calculator, DollarSign } from "lucide-react";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeOption {
  id: string;
  title: string;
  yield: number;
  yield_label: string;
  ingredients: Ingredient[];
}

const MOCK_RECIPES: RecipeOption[] = [
  {
    id: "r1",
    title: "Pão de Campanha Rústico",
    yield: 2,
    yield_label: "pães",
    ingredients: [
      { name: "Farinha de Trigo", amount: 800, unit: "g" },
      { name: "Farinha Integral", amount: 200, unit: "g" },
      { name: "Água", amount: 750, unit: "ml" },
      { name: "Sal", amount: 20, unit: "g" }
    ]
  },
  {
    id: "r2",
    title: "Cookies de Chocolate",
    yield: 15,
    yield_label: "unidades",
    ingredients: [
      { name: "Farinha de Trigo", amount: 250, unit: "g" },
      { name: "Manteiga", amount: 150, unit: "g" },
      { name: "Açúcar Mascavo", amount: 100, unit: "g" },
      { name: "Chocolate Meio Amargo", amount: 200, unit: "g" }
    ]
  }
];

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CostCalculatorModal({ isOpen, onClose }: CostCalculatorModalProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  // key: `${recipeId}-${ingredientIndex}` -> value: { packPrice, packSize }
  const [pricing, setPricing] = useState<Record<string, { packPrice: number; packSize: number }>>({});

  const selectedRecipe = useMemo(() => MOCK_RECIPES.find(r => r.id === selectedRecipeId), [selectedRecipeId]);

  const handlePricingChange = (ingredientIdx: number, field: 'packPrice' | 'packSize', value: string) => {
    if (!selectedRecipe) return;
    const key = `${selectedRecipe.id}-${ingredientIdx}`;
    const numValue = parseFloat(value) || 0;
    
    setPricing(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { packPrice: 0, packSize: 0 }),
        [field]: numValue
      }
    }));
  };

  const getIngredientCost = (idx: number, requiredAmount: number) => {
    if (!selectedRecipe) return 0;
    const key = `${selectedRecipe.id}-${idx}`;
    const priceInfo = pricing[key];
    if (!priceInfo || priceInfo.packSize === 0) return 0;
    return (priceInfo.packPrice / priceInfo.packSize) * requiredAmount;
  };

  const totalCost = useMemo(() => {
    if (!selectedRecipe) return 0;
    return selectedRecipe.ingredients.reduce((acc, ing, idx) => {
      return acc + getIngredientCost(idx, ing.amount);
    }, 0);
  }, [selectedRecipe, pricing]);

  const costPerPortion = useMemo(() => {
    if (!selectedRecipe || selectedRecipe.yield === 0) return 0;
    return totalCost / selectedRecipe.yield;
  }, [totalCost, selectedRecipe]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#FDFCF8] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-[#E2D6C0]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 bg-white border-b border-[#E2D6C0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#5A5A40]/10 text-[#5A5A40] rounded-2xl flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#2C2115]">Calculadora de Custos</h2>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-40 text-[#5A5A40]">Precificação Inteligente</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#FDFCF8] rounded-full transition-colors text-[#5A5A40] opacity-40 hover:opacity-100"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Recipe Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold opacity-60 text-[#5A5A40]">Selecione uma Receita</label>
                <select 
                  className="w-full bg-white border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-serif text-lg text-[#2C2115] shadow-sm appearance-none"
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                >
                  <option value="" disabled>Escolha no seu caderno...</option>
                  {MOCK_RECIPES.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              {selectedRecipe && (
                <div className="space-y-6">
                  {/* Ingredients List */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-bold opacity-40 text-[#5A5A40] border-b border-[#E2D6C0]/50 pb-2">Ingredientes & Precificação</h3>
                    
                    <div className="space-y-4">
                      {selectedRecipe.ingredients.map((ing, idx) => {
                        const cost = getIngredientCost(idx, ing.amount);
                        const key = `${selectedRecipe.id}-${idx}`;
                        const pInfo = pricing[key] || { packPrice: '', packSize: '' };
                        return (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E2D6C0] flex flex-col md:flex-row md:items-center gap-4 hover:border-[#5A5A40]/30 transition-colors shadow-sm">
                            <div className="flex-1">
                              <p className="font-serif font-bold text-[#2C2115] text-lg">{ing.name}</p>
                              <p className="text-xs font-sans uppercase tracking-widest opacity-60 text-[#5A5A40] font-bold">Requer: <span className="text-[#2C2115]">{ing.amount}{ing.unit}</span></p>
                            </div>
                            
                            <div className="flex gap-3 flex-1">
                              <div className="flex-1 space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#5A5A40] opacity-60 ml-2">Preço da Embalagem (R$)</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#5A5A40] opacity-40">
                                    <DollarSign size={14} />
                                  </div>
                                  <input 
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={pInfo.packPrice || ''}
                                    onChange={(e) => handlePricingChange(idx, 'packPrice', e.target.value)}
                                    className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#5A5A40] opacity-60 ml-2">Capacidade ({ing.unit})</label>
                                <input 
                                  type="number"
                                  min="0"
                                  placeholder={`Tamanho em ${ing.unit}`}
                                  value={pInfo.packSize || ''}
                                  onChange={(e) => handlePricingChange(idx, 'packSize', e.target.value)}
                                  className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                                />
                              </div>
                            </div>

                            <div className="md:w-24 text-right pt-2 md:pt-0 border-t md:border-t-0 border-[#E2D6C0]/50 md:border-none">
                              <span className="text-sm font-sans uppercase tracking-widest opacity-40 text-[#5A5A40] font-bold block md:hidden mb-1">Custo Proporcional</span>
                              <span className="font-serif font-bold text-lg text-[#5A5A40]">R$ {cost.toFixed(2)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {selectedRecipe && (
              <div className="bg-[#5A5A40] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-8">
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Rendimento</p>
                    <p className="text-xl font-serif">{selectedRecipe.yield} <span className="text-sm opacity-80">{selectedRecipe.yield_label}</span></p>
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Custo Total</p>
                    <p className="text-xl font-serif">R$ {totalCost.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="bg-white text-[#5A5A40] px-6 py-4 rounded-2xl text-center shadow-xl shadow-black/10">
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Custo por {selectedRecipe.yield_label.replace(/s$/, '').replace(/es$/, 'e')}</p>
                  <p className="text-3xl font-serif font-bold leading-none">R$ {costPerPortion.toFixed(2)}</p>
                </div>
              </div>
            )}
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
