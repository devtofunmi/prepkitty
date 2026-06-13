
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, FileText, BrainCircuit } from 'lucide-react';

interface ChatActionResultProps {
  title: string;
  summary: string;
  onStartNew: () => void;
  buttonText: string;
  onSecondaryAction?: () => void;
  secondaryButtonText?: string;
  isModal?: boolean;
}

const ChatActionResult: React.FC<ChatActionResultProps> = ({
  title,
  summary,
  onStartNew,
  buttonText,
  onSecondaryAction,
  secondaryButtonText,
}) => {
  
  const formatSummary = (text: string) => {
    // Basic formatting for AI summary text
    return text.split('\n').map((line, i) => {
      if (line.trim().startsWith('*')) {
        return (
          <li key={i} className="mb-3 flex list-none gap-3 break-words text-slate-600 font-medium leading-relaxed [overflow-wrap:anywhere]">
            <Star size={14} className="mt-1 flex-shrink-0 fill-blue-500 text-blue-500" />
            <span>{line.replace(/^\*/, '').trim()}</span>
          </li>
        );
      }
      return <p key={i} className="mb-4 break-words text-slate-700 font-medium leading-relaxed [overflow-wrap:anywhere]">{line}</p>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto space-y-8 pb-20 text-left"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-blue-500/5 md:p-8 lg:p-10">
        <div className="absolute right-8 top-8 opacity-5 rotate-12"><FileText size={180} /></div>
        
        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600">
                <Star size={28} fill="currentColor" />
              </div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Interview done</p>
              <h3 className="text-4xl font-black tracking-tighter text-slate-900 italic md:text-5xl">{title}</h3>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-slate-500 italic">
                Read your feedback below, then practice again or try quiz mode.
              </p>
            </div>
          </div>
          
          <div className="mb-8 rounded-[2rem] border border-slate-100 bg-slate-50/70 p-5 md:p-8">
            <div className="max-w-none text-base">
              {formatSummary(summary)}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row">
            <button
              onClick={onStartNew}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-8 py-5 font-black italic text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95 sm:w-auto"
            >
              {buttonText} <ArrowRight size={20} />
            </button>

            {onSecondaryAction && secondaryButtonText && (
              <button
                onClick={onSecondaryAction}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-5 font-black italic text-slate-900 transition-all hover:border-blue-200 hover:bg-blue-50 active:scale-95 sm:w-auto"
              >
                <BrainCircuit size={20} /> {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatActionResult;
