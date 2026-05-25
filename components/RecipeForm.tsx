import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { 
  Type, 
  ListOrdered, 
  ChefHat, 
  Clock, 
  Users, 
  Trophy, 
  DollarSign, 
  Save,
  CheckCircle2
} from "lucide-react";
import { RecipeFormData } from "../types";

export default function RecipeForm() {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    ingredients: "",
    instructions: "",
    prep_time: 0,
    cook_time: 0,
    yield_quantity: 1,
    yield_unit: "porções",
    effort_level: "Médio",
    cost: "$$"
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalTime = formData.prep_time + formData.cook_time;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
       // Convert markup strings to simple arrays to comply with our backend expectations 
       // (Alternatively we can store as text but our schema implies array of lines)
       const ingredientsArray = formData.ingredients.split('\n').filter(i => i.trim() !== '');
       const instructionsArray = formData.instructions.split('\n').filter(i => i.trim() !== '');
       
       const response = await fetch("/api/v1/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: "", // could add description field later
            total_time: totalTime,
            effort_level: formData.effort_level,
            cost: formData.cost,
            yield: `${formData.yield_quantity} ${formData.yield_unit}`,
            image_url: "", // mock
            ingredients: ingredientsArray,
            instructions: instructionsArray,
          })
       });

       if (!response.ok) {
           throw new Error("Falha ao salvar receita.");
       }

       const newRecipe = await response.json();
       console.log("Receita Criada:", newRecipe);
       
       setSubmitted(true);
       setFormData({
         title: "",
         ingredients: "",
         instructions: "",
         prep_time: 0,
         cook_time: 0,
         yield_quantity: 1,
         yield_unit: "porções",
         effort_level: "Médio",
         cost: "$$"
       });
       setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
       console.error(err);
       setError("Ocorreu um erro ao salvar sua receita. Tente novamente.");
    } finally {
       setSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-light mb-3">Nova Receita</h2>
        <p className="text-[#5A5A40] italic">Crie o seu próximo clássico. Preencha os detalhes abaixo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[32px] shadow-sm border border-[#E2D6C0]">
        {/* Título */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
            <Type size={14} /> Título da Receita
          </label>
          <input 
            type="text"
            required
            placeholder="Ex: Pão de Milho da Vovó"
            className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-serif text-lg"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Ingredientes e Instruções */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <ListOrdered size={14} /> Ingredientes (Markdown)
            </label>
            <textarea 
              rows={8}
              placeholder="- 500g Farinha\n- 300ml Água..."
              className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all resize-none font-mono text-sm"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <ChefHat size={14} /> Instruções (Markdown)
            </label>
            <textarea 
              rows={8}
              placeholder="1. Misture os secos...\n2. Adicione os líquidos..."
              className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all resize-none font-mono text-sm"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </div>

        {/* Tempos e Rendimento */}
        <div className="grid sm:grid-cols-3 gap-6 bg-[#FDFCF8] p-6 rounded-2xl border border-[#E2D6C0]">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Clock size={14} /> Preparo (min)
            </label>
            <input 
              type="number"
              min="0"
              className="w-full bg-white border border-[#E2D6C0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
              value={formData.prep_time}
              onChange={(e) => setFormData({ ...formData, prep_time: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Clock size={14} /> Cozimento (min)
            </label>
            <input 
              type="number"
              min="0"
              className="w-full bg-white border border-[#E2D6C0] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
              value={formData.cook_time}
              onChange={(e) => setFormData({ ...formData, cook_time: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex flex-col justify-end pb-3">
             <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30">Tempo Total</span>
             <span className="text-2xl font-serif text-[#5A5A40]">{totalTime} minutos</span>
          </div>
        </div>

        {/* Rendimento, Esforço e Custo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rendimento */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Users size={14} /> Rendimento
            </label>
            <div className="flex gap-2">
              <input 
                type="number"
                min="1"
                className="w-16 bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-2 py-2 focus:outline-none transition-all font-sans"
                value={formData.yield_quantity}
                onChange={(e) => setFormData({ ...formData, yield_quantity: parseInt(e.target.value) || 0 })}
              />
              <input 
                type="text"
                placeholder="porções"
                className="flex-1 w-16 bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl px-3 py-2 focus:outline-none transition-all font-sans"
                value={formData.yield_unit}
                onChange={(e) => setFormData({ ...formData, yield_unit: e.target.value })}
              />
            </div>
          </div>

          {/* Esforço */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <Trophy size={14} /> Nível de Esforço
            </label>
            <div className="flex bg-[#FDFCF8] p-1 rounded-xl border border-[#E2D6C0] gap-1">
              {(['Fácil', 'Médio', 'Desafiador'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, effort_level: level })}
                  className={`flex-1 min-w-0 px-1 py-2 rounded-lg text-[10px] uppercase font-bold transition-all truncate ${
                    formData.effort_level === level 
                      ? 'bg-[#5A5A40] text-white shadow-sm' 
                      : 'hover:bg-black/5 text-[#5A5A40]/70'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Custo */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold opacity-60 flex items-center gap-2">
              <DollarSign size={14} /> Custo Estimado
            </label>
            <div className="flex bg-[#FDFCF8] p-1 rounded-xl border border-[#E2D6C0] gap-1">
              {(['$', '$$', '$$$'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, cost: c })}
                  className={`flex-1 min-w-0 py-2 rounded-lg text-sm font-bold transition-all ${
                    formData.cost === c 
                      ? 'bg-[#5A5A40] text-white shadow-sm' 
                      : 'hover:bg-black/5 text-[#5A5A40]/70'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
               {error}
            </div>
        )}

        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-sans font-bold uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${
            submitted 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : submitting 
                 ? 'bg-[#5A5A40]/70 text-white cursor-not-allowed'
                 : 'bg-[#5A5A40] hover:bg-[#4A4A30] text-white'
          }`}
        >
          {submitted ? (
             <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-2">
               <CheckCircle2 size={20} /> Receita Salva!
             </motion.div>
          ) : submitting ? (
             <>Salvando...</>
          ) : (
            <>
              <Save size={20} /> Salvar Receita
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
