import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Play, Pause, RotateCcw, Plus, BellOff, X, Trash2, Minus } from "lucide-react";

interface Timer {
  id: string;
  name: string;
  initialTime: number; // in seconds
  remainingTime: number; // in seconds
  isRunning: boolean;
}

interface FloatingTimerProps {
  onClose?: () => void;
}

export default function FloatingTimer({ onClose }: FloatingTimerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  
  const [timers, setTimers] = useState<Timer[]>([
    { id: "1", name: "Autólise", initialTime: 1800, remainingTime: 1800, isRunning: false },
    { id: "2", name: "Forno", initialTime: 5, remainingTime: 5, isRunning: false }
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Placeholder audio for restaurant bell (Mesa 4!)
    audioRef.current = new Audio("https://cdn.freesound.org/previews/411/411088_5121236-lq.mp3");
    audioRef.current.loop = true; // loop until dismissed
  }, []);

  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        let shouldAlarm = false;
        const updated = prev.map(t => {
          if (!t.isRunning || t.remainingTime <= 0) return t;
          const nextTime = t.remainingTime - 1;
          if (nextTime === 0) {
            shouldAlarm = true;
          }
          return { ...t, remainingTime: nextTime, isRunning: nextTime > 0 };
        });

        if (shouldAlarm && !isAlarmRinging) {
           setIsAlarmRinging(true);
           if (!isExpanded) setIsExpanded(true);
           audioRef.current?.play().catch(() => console.log('Audio autoplay blocked by browser'));
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExpanded, isAlarmRinging]);

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleTimer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTimers(prev => prev.map(t => t.id === id ? { ...t, isRunning: !t.isRunning } : t));
  };

  const resetTimer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTimers(prev => prev.map(t => t.id === id ? { ...t, remainingTime: t.initialTime, isRunning: false } : t));
  };

  const removeTimer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // Find the timer closest to ending to show on the pill
  const closestTimer = timers
    .filter(t => t.remainingTime > 0)
    .sort((a, b) => a.remainingTime - b.remainingTime)[0];

  const handleAddTimer = () => {
    const name = window.prompt("Nome do temporizador (ex: Forno):");
    if (!name) return;
    const mins = window.prompt("Tempo em minutos:");
    const timeInSeconds = parseInt(mins || "0") * 60;
    if (timeInSeconds > 0) {
       setTimers(prev => [...prev, {
         id: Math.random().toString(36).substr(2, 9),
         name,
         initialTime: timeInSeconds,
         remainingTime: timeInSeconds,
         isRunning: false
       }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`mb-4 w-72 bg-[#FDFCF8] text-[#2C2115] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-[#E2D6C0] transition-all duration-300 ${
              isAlarmRinging ? 'ring-4 ring-amber-500 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)]' : ''
            }`}
          >
            <div className="flex justify-between items-center border-b border-[#E2D6C0] pb-2">
              <h3 className="font-serif text-lg font-bold">Temporizadores</h3>
              <div className="flex items-center gap-1 text-[#5A5A40]/60">
                <button onClick={() => setIsExpanded(false)} className="hover:text-[#2C2115] transition-colors p-1" title="Minimizar">
                  <Minus size={20} />
                </button>
                {onClose && (
                  <button onClick={onClose} className="hover:text-[#2C2115] transition-colors p-1" title="Fechar">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto w-full no-scrollbar">
              {timers.length === 0 && <p className="text-xs opacity-50 italic text-center py-4">Nenhum temporizador ativo.</p>}
              {timers.map(timer => (
                <div key={timer.id} className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-[#E2D6C0] shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest truncate mr-2">{timer.name}</span>
                    <span className={`font-mono text-xl ${timer.remainingTime === 0 ? 'text-amber-500 animate-pulse font-bold' : ''}`}>
                      {formatTime(timer.remainingTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                     <button onClick={(e) => removeTimer(timer.id, e)} className="text-red-500/60 hover:text-red-500 p-1 transition-colors">
                       <Trash2 size={14} />
                     </button>
                     <div className="flex gap-2">
                      <button 
                        onClick={(e) => resetTimer(timer.id, e)} 
                        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-[#5A5A40]"
                        title="Zerar Temporizador"
                      >
                        <RotateCcw size={14} />
                      </button>
                      {timer.remainingTime > 0 && (
                        <button 
                          onClick={(e) => toggleTimer(timer.id, e)} 
                          className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-400 transition-colors"
                        >
                          {timer.isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                      )}
                     </div>
                  </div>
                </div>
              ))}
            </div>

            {isAlarmRinging && (
               <button 
                 onClick={handleStopAlarm}
                 className="w-full py-3 mt-1 bg-amber-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors animate-bounce"
               >
                 <BellOff size={16} /> Desligar Alarme
               </button>
            )}

            {!isAlarmRinging && (
              <button 
                onClick={handleAddTimer}
                className="w-full py-3 mt-1 border border-[#E2D6C0] text-[#5A5A40] hover:text-[#2C2115] hover:bg-neutral-100 font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} /> Novo Tempo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl transition-all duration-300 ${
          isAlarmRinging 
            ? 'bg-amber-500 text-white ring-4 ring-amber-500 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
            : 'bg-[#FDFCF8] text-[#2C2115] hover:bg-white border border-[#E2D6C0]'
        }`}
      >
        <Clock size={20} className={isAlarmRinging ? "animate-bounce" : ""} />
        {!isExpanded && (
          <span className="font-mono font-bold">
            {closestTimer ? formatTime(closestTimer.remainingTime) : "00:00"}
          </span>
        )}
      </motion.button>
    </div>
  );
}
