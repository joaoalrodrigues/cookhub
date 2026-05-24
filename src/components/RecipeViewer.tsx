import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft,
  Clock, 
  Trophy, 
  DollarSign, 
  User as UserIcon,
  Users,
  ChefHat,
  BookmarkPlus,
  Play,
  Plus,
  MessageSquareQuote
} from "lucide-react";
import { CommunityRecipe } from "../types";

const MOCK_RECIPE_DETAILS = {
  "e1": {
    id: "e1",
    title: "Pão de Forma Integral de Mel",
    author: "Alice Ferreira",
    total_time: 150,
    effort_level: "Médio",
    cost: "$",
    yield: "1 pão (12 fatias)",
    image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1000&auto=format&fit=crop",
    description: "Um pão macio, levemente adocicado pelo mel e perfeito para o café da manhã. A farinha integral traz uma textura rústica deliciosa.",
    ingredients: [
      "500g de farinha de trigo integral",
      "10g de sal",
      "10g de fermento biológico seco",
      "300ml de água morna",
      "50g de mel",
      "30ml de azeite"
    ],
    instructions: [
      "Misture a farinha e o sal em uma tigela grande.",
      "Dissolva o fermento na água morna com o mel.",
      "Adicione os líquidos e o azeite aos secos e misture até formar uma massa pegajosa.",
      "Sove a massa por 10-15 minutos até ficar elástica.",
      "Deixe a massa descansar coberta por 1 hora ou até dobrar de tamanho.",
      "Modele o pão e coloque na forma untada.",
      "Deixe crescer por mais 45 minutos.",
      "Asse em forno pré-aquecido a 200°C por 35-40 minutos."
    ]
  },
  "e2": { 
    id: "e2", 
    title: "Pizza Napolitana", 
    author: "Marco Rossi", 
    total_time: 480, 
    effort_level: "Desafiador", 
    cost: "$$", 
    yield: "2 pizzas grandes",
    image_url: "https://images.unsplash.com/photo-1574129624952-329cc250917e?w=1000&auto=format&fit=crop",
    description: "A clássica pizza italiana com bordas altas e macias (cornicione) e um centro fino, assada em alta temperatura.",
    ingredients: [
        "500g de farinha 00",
        "325ml de água",
        "15g de sal fino",
        "1.5g de fermento biológico fresco",
        "Molho de tomate San Marzano",
        "Muçarela de búfala fresca",
        "Folhas de manjericão fresco",
        "Azeite extra virgem"
    ],
    instructions: [
        "Dissolva o sal na água. Adicione 10% da farinha e misture.",
        "Adicione o fermento e, em seguida, o restante da farinha aos poucos.",
        "Sove a massa por 20 minutos até ficar lisa e elástica.",
        "Cubra a massa e deixe descansar por 2 horas a temperatura ambiente.",
        "Divida a massa em bolas de 250g. Coloque em recipientes herméticos e deixe fermentar por mais 6-8 horas.",
        "Estique a massa com as mãos (nunca use rolo), adicionando a cobertura no centro.",
        "Asse em forno para pizza (idealmente 400°C+) por 60 a 90 segundos."
    ]
  },
  "e3": { 
    id: "e3", 
    title: "Cookies de Aveia e Passas", 
    author: "Júlia Mendes", 
    total_time: 30, 
    effort_level: "Fácil", 
    cost: "$", 
    yield: "15 cookies",
    image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=1000&auto=format&fit=crop",
    description: "Cookies macios por dentro, crocantes nas bordas. Uma pedida fácil para adoçar o café da tarde.",
    ingredients: [
        "150g de manteiga amolecida",
        "100g de açúcar mascavo",
        "50g de açúcar cristal",
        "1 ovo inteiro",
        "100g de farinha de trigo",
        "150g de aveia em flocos",
        "1 colher (chá) de canela em pó",
        "1 colher (chá) de bicarbonato de sódio",
        "80g de uvas passas pretas"
    ],
    instructions: [
        "Pré-aqueça o forno a 180°C e forre uma assadeira com papel manteiga.",
        "Na batedeira, bata a manteiga com os açúcares até formar um creme fofo.",
        "Adicione o ovo e bata apenas para incorporar.",
        "Em uma tigela, misture a farinha, a aveia, a canela e o bicarbonato.",
        "Incorpore os secos ao creme de manteiga aos poucos, misturando com uma espátula.",
        "Adicione as passas e misture suavemente.",
        "Faça bolinhas com a massa e distribua na assadeira (deixe espaço entre eles).",
        "Asse por 12-15 minutos. As bordas devem estar douradas e o centro ainda macio."
    ]
  },
  "e4": { 
    id: "e4", 
    title: "Brioche de Chocolate", 
    author: "Lucas Porto", 
    total_time: 240, 
    effort_level: "Médio", 
    cost: "$$$", 
    yield: "1 pão grande",
    image_url: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=1000&auto=format&fit=crop",
    description: "Massa super enriquecida com manteiga e ovos, mesclada com muito chocolate amargo. Derrete na boca.",
    ingredients: [
        "350g de farinha de trigo",
        "150g de manteiga gelada em cubos",
        "3 ovos grandes",
        "40g de açúcar",
        "8g de sal",
        "10g de fermento biológico seco",
        "60ml de leite",
        "150g de chocolate meio amargo em gotas ou picado"
    ],
    instructions: [
        "Bata a farinha, o açúcar, o sal e o fermento na batedeira com o gancho.",
        "Adicione os ovos batidos e o leite, sovando até a massa incorporar todo o líquido.",
        "Com a batedeira ligada (velocidade média/baixa), incorpore a manteiga pedaço por pedaço.",
        "Sove até desenvolver bem o glúten (ponto de véu) - a massa será brilhante e super elástica.",
        "Deixe descansar em temperatura ambiente por 1 hora, faça dobras e leve à geladeira por 2 horas (ou overnight).",
        "Abra a massa fria, espalhe as gotas de chocolate, e enrole ou trance modelando o brioche.",
        "Deixe crescer na forma untada por cerca de 1 a 2 horas, até dobrar de tamanho.",
        "Pincele com ovo batido e asse a 180°C por 35-45 minutos."
    ]
  }
};

interface Note {
  id: string;
  text: string;
  date: string;
}

type NotesRecord = Record<string, Note[]>;

interface RecipeViewerProps {
  recipeId: string;
  onBack: () => void;
}

export default function RecipeViewer({ recipeId, onBack }: RecipeViewerProps) {
  const recipe = (MOCK_RECIPE_DETAILS as any)[recipeId] || MOCK_RECIPE_DETAILS["e1"];
  
  const [notes, setNotes] = useState<NotesRecord>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const handleAddNote = (key: string) => {
    if (!inputText.trim()) {
      setActiveInput(null);
      return;
    }
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText.trim(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    setNotes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newNote]
    }));
    setInputText("");
    setActiveInput(null);
  };

  const NoteInput = ({ itemKey }: { itemKey: string }) => {
    if (activeInput !== itemKey) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 flex flex-col gap-3 overflow-hidden ml-2 sm:ml-4"
      >
        <textarea 
          autoFocus
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Adicione uma nota de teste... (Ex: Ficou muito doce, tentar reduzir o açúcar em 10g)"
          className="w-full bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl p-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 resize-none shadow-inner"
          rows={2}
        />
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setActiveInput(null)} 
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity"
          >
            Cancelar
          </button>
          <button 
            onClick={() => handleAddNote(itemKey)} 
            className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-[#5A5A40] text-white rounded-xl shadow-sm hover:bg-[#4A4A30] transition-colors"
          >
            Salvar Nota
          </button>
        </div>
      </motion.div>
    );
  };

  const NoteList = ({ itemKey }: { itemKey: string }) => {
    const itemNotes = notes[itemKey] || [];
    if (itemNotes.length === 0) return null;
    return (
      <div className="mt-4 space-y-3 ml-2 sm:ml-4">
        {itemNotes.map(n => (
          <motion.div 
            key={n.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FDFCF8] border border-[#E2D6C0] p-4 rounded-2xl rounded-tl-sm relative"
          >
            <MessageSquareQuote size={16} className="absolute top-4 left-4 text-[#5A5A40] opacity-30" />
            <p className="text-sm text-[#2C2115] ml-8 font-serif italic text-pretty">{n.text}</p>
            <span className="text-[10px] text-[#5A5A40] opacity-50 ml-8 block mt-2 uppercase tracking-[0.15em] font-bold font-sans">
              {n.date}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#5A5A40] opacity-60 hover:opacity-100 transition-opacity font-sans uppercase tracking-widest text-[10px] font-bold"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FDFCF8] border border-[#E2D6C0] rounded-xl text-[10px] uppercase font-bold text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white transition-all shadow-sm">
          <BookmarkPlus size={16} /> Salvar Receita
        </button>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-[#E2D6C0] shadow-sm">
        {/* Header Hero */}
        <div className="relative h-64 md:h-96 w-full group">
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight text-balance">{recipe.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-sans opacity-90">
              <span className="flex items-center gap-2 font-medium"><UserIcon size={16} /> {recipe.author}</span>
              <span className="opacity-40 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-2 font-medium"><Clock size={16} /> {recipe.total_time} min</span>
              <span className="opacity-40 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-2 font-medium"><Trophy size={16} /> {recipe.effort_level}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_300px] gap-12 p-6 md:p-12">
          
          <div className="space-y-12">
            <div>
              <p className="text-lg md:text-xl leading-relaxed text-[#2C2115]/80 font-serif italic border-l-4 border-[#E2D6C0] pl-6">
                {recipe.description}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-[#E2D6C0] pb-4">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <ChefHat className="text-[#5A5A40] opacity-80" /> 
                  Instruções Passo a Passo
                </h2>
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold font-sans">
                  {recipe.instructions.length} Passos
                </span>
              </div>

              <div className="space-y-8">
                {recipe.instructions.map((step: string, idx: number) => {
                  const key = `step-${idx}`;
                  return (
                    <div key={key} className="flex gap-4 md:gap-6 group/step">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FDFCF8] border border-[#E2D6C0] flex items-center justify-center font-bold font-sans text-sm text-[#5A5A40] group-hover/step:bg-[#5A5A40] group-hover/step:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-[#2C2115] leading-relaxed text-base md:text-lg opacity-90">{step}</p>
                          <button 
                            onClick={() => { setActiveInput(key); setInputText(""); }}
                            className={`p-2 rounded-full transition-all shrink-0 -mt-1
                              ${activeInput === key || (notes[key] && notes[key].length > 0) 
                                ? 'text-[#5A5A40] bg-[#FDFCF8] border border-[#E2D6C0]' 
                                : 'text-[#5A5A40]/30 hover:text-[#5A5A40] hover:bg-[#FDFCF8] opacity-0 group-hover/step:opacity-100'}`}
                            title="Adicionar nota de teste"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <AnimatePresence>
                          <NoteList itemKey={key} />
                          <NoteInput itemKey={key} />
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-[#FDFCF8] p-6 rounded-[24px] border border-[#E2D6C0] space-y-6">
              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <Users size={18} className="text-[#5A5A40] opacity-80" /> 
                Rendimento
              </h3>
              <p className="font-sans font-medium text-[#2C2115] opacity-90">{recipe.yield}</p>

              <hr className="border-[#E2D6C0]" />

              <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                <DollarSign size={18} className="text-[#5A5A40] opacity-80" /> 
                Custo Médio
              </h3>
              <p className="font-sans font-medium text-[#2C2115] opacity-90">{recipe.cost}</p>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-[#E2D6C0] space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-serif">Ingredientes</h3>
                <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold font-sans">
                  {recipe.ingredients.length} Itens
                </span>
              </div>
              <ul className="space-y-5 font-sans justify-center">
                {recipe.ingredients.map((item: string, idx: number) => {
                  const key = `ingredient-${idx}`;
                  return (
                    <li key={key} className="group/ing flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 text-[#2C2115] opacity-90 leading-snug pt-1 text-sm md:text-base">
                          <span className="text-[#5A5A40] opacity-40 shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </div>
                        <button 
                          onClick={() => { setActiveInput(key); setInputText(""); }}
                          className={`p-1.5 rounded-full transition-all shrink-0 mt-0.5
                            ${activeInput === key || (notes[key] && notes[key].length > 0) 
                              ? 'text-[#5A5A40] bg-[#FDFCF8] border border-[#E2D6C0]' 
                              : 'text-[#5A5A40]/30 hover:text-[#5A5A40] hover:bg-[#FDFCF8] opacity-0 group-hover/ing:opacity-100'}`}
                          title="Adicionar nota para ingrediente"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <AnimatePresence>
                        <NoteList itemKey={key} />
                        <NoteInput itemKey={key} />
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <button className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-sans font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
               <Play size={18} className="fill-current" /> Modo Cozinha
            </button>
          </aside>

        </div>
      </div>
    </motion.div>
  );
}
