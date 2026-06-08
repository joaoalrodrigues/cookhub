import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { 
  Camera, 
  Lightbulb, 
  Save, 
  ChevronDown
} from "lucide-react";

export default function DiaryForm() {
  const [flavor, setFlavor] = useState<string | null>(null);
  const [texture, setTexture] = useState<string | null>(null);
  const [recipe, setRecipe] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [yieldAmount, setYieldAmount] = useState("");
  const [notes, setNotes] = useState("");

  const flavorOptions = ["Faltou tempero", "Bom", "Surpreendente"];
  const textureOptions = ["Passou do ponto", "No ponto", "Precisa de ajustes"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-10">
        <h2 className="text-4xl font-light mb-3 font-serif">Diário de Cozinha</h2>
        <p className="text-[#5A5A40] italic">Registe as suas experiências, acertos e pontos a melhorar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário Principal - 2/3 */}
        <div className="lg:col-span-2 space-y-8 bg-white p-6 md:p-10 rounded-[32px] border border-[#E2D6C0] shadow-sm">
          
          {/* Seletor de Receita */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Receita</label>
            <div className="relative">
              <select 
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-2xl py-4 px-5 text-lg font-serif appearance-none focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] transition-colors"
              >
                <option value="" disabled>Selecione uma receita preparada...</option>
                <option value="r1">Pão de Centeio e Mel</option>
                <option value="r2">Muffins de Blueberry</option>
                <option value="r3">Torta de Maçã Invertida</option>
                <option value="r4">Ciabatta de Longa Fermentação</option>
                <option value="outro">Outra receita</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5A5A40] pointer-events-none" size={20} />
            </div>
          </div>

          {/* Métricas Práticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Tempo Real (min)</label>
              <input 
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="Ex: 45"
                className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-2xl py-4 px-5 text-lg font-serif focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Rendimento (porções)</label>
              <input 
                type="number"
                value={yieldAmount}
                onChange={(e) => setYieldAmount(e.target.value)}
                placeholder="Ex: 4"
                className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-2xl py-4 px-5 text-lg font-serif focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] transition-colors"
              />
            </div>
          </div>

          {/* Notas da Experiência */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Notas da Experiência</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que correu bem? O que faria diferente na próxima vez? Que substituições fez?"
              rows={5}
              className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-2xl py-4 px-5 text-lg font-serif focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] resize-none transition-colors"
            />
          </div>

          {/* Avaliação Qualitativa */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Sabor Geral</label>
              <div className="flex flex-wrap gap-3">
                {flavorOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFlavor(opt)}
                    className={`px-5 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wide transition-all border ${
                      flavor === opt 
                        ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-md' 
                        : 'bg-[#FDFCF8] border-[#E2D6C0] text-[#2C2115] hover:border-[#5A5A40] hover:bg-neutral-50/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Textura / Ponto</label>
              <div className="flex flex-wrap gap-3">
                {textureOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTexture(opt)}
                    className={`px-5 py-3 rounded-full text-sm font-sans font-bold uppercase tracking-wide transition-all border ${
                      texture === opt 
                        ? 'bg-[#5A5A40] border-[#5A5A40] text-white shadow-md' 
                        : 'bg-[#FDFCF8] border-[#E2D6C0] text-[#2C2115] hover:border-[#5A5A40] hover:bg-neutral-50/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Visual */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-[#2C2115] mb-3 opacity-60">Foto do Resultado</label>
            <div className="border-2 border-dashed border-neutral-300 bg-neutral-50/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FDFCF8] hover:border-[#5A5A40]/40 transition-colors group">
              <div className="w-16 h-16 bg-white border border-[#E2D6C0] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                <Camera className="text-[#2C2115]" size={28} />
              </div>
              <h4 className="font-serif text-lg text-[#2C2115] font-medium mb-1">Arraste a foto ou clique para procurar</h4>
              <p className="text-sm text-[#5A5A40]/60">Formatos suportados: JPG, PNG, WEBP</p>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg text-sm">
              <Save size={20} /> Salvar no Diário
            </button>
          </div>
        </div>

        {/* Painel Lateral - 1/3 */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
          <div className="bg-[#FDFCF8] text-[#2C2115] rounded-[32px] p-8 shadow-sm border border-[#E2D6C0]">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="text-[#5A5A40]" size={24} />
              <h3 className="font-serif text-2xl font-bold">Dicas Pro</h3>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#E2D6C0] hover:border-[#5A5A40]/30 transition-colors shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-[#5A5A40]">Anotar Substituições</h4>
                <p className="text-sm text-[#2C2115]/80 leading-relaxed font-serif">
                  Não se esqueça de registar as farinhas alternativas que usou ou a substituição de açúcar. Elas mudam completamente a estrutura do resultado final.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2D6C0] hover:border-[#5A5A40]/30 transition-colors shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-[#5A5A40]">Clima e Temperatura</h4>
                <p className="text-sm text-[#2C2115]/80 leading-relaxed font-serif">
                  Dias quentes ou húmidos afetam drasticamente os tempos de fermentação e textura de massas. Registe como estava o dia.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E2D6C0] hover:border-[#5A5A40]/30 transition-colors shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-[#5A5A40]">Honestidade</h4>
                <p className="text-sm text-[#2C2115]/80 leading-relaxed font-serif">
                  Erros são os melhores professores. Seja direto no registo sobre as falhas porque são elas que você vai ler antes de tentar novamente.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
