
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, XCircle, CheckCircle2, MessageSquare } from 'lucide-react';

interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface ActionResultProps {
  title: string;
  score: number;
  total: number;
  onStartNew: () => void;
  buttonText: string;
  onSecondaryAction?: () => void;
  secondaryButtonText?: string;
  wrongAnswers?: WrongAnswer[];
  isModal?: boolean; 
}

const ActionResult: React.FC<ActionResultProps> = ({
  title,
  score,
  total,
  onStartNew,
  buttonText,
  onSecondaryAction,
  secondaryButtonText,
  wrongAnswers,
}) => {
  const missedCount = wrongAnswers?.length || 0;
  const accuracy = Math.round((score / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto space-y-8 pb-20 text-left"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-blue-500/5 md:p-10">
          <div className="absolute right-8 top-8 opacity-5">
            <Trophy size={130} />
          </div>

          <div className="relative z-10">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600">
              <Trophy size={30} />
            </div>

            <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Quiz done</p>
            <h3 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 italic md:text-5xl">{title}</h3>
            <p className="max-w-lg text-lg font-medium leading-relaxed text-slate-500 italic">
              You got {score} out of {total} questions right.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
                  <MessageSquare size={20} /> {secondaryButtonText}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-1">
          <div className="min-w-0 rounded-[1.35rem] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[2rem] sm:p-6">
            <p className="mb-2 truncate text-[9px] font-black uppercase tracking-widest text-slate-400 italic sm:mb-3 sm:text-[10px]">Score</p>
            <p className="text-2xl font-black tracking-tighter text-slate-900 tabular-nums sm:text-5xl">
              {score}<span className="text-sm font-medium text-slate-300 sm:text-xl">/{total}</span>
            </p>
          </div>

          <div className="min-w-0 rounded-[1.35rem] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[2rem] sm:p-6">
            <p className="mb-2 truncate text-[9px] font-black uppercase tracking-widest text-slate-400 italic sm:mb-3 sm:text-[10px]">Accuracy</p>
            <p className="text-2xl font-black tracking-tighter text-blue-600 tabular-nums sm:text-5xl">{accuracy}%</p>
          </div>

          <div className="min-w-0 rounded-[1.35rem] border border-slate-100 bg-white p-3 shadow-sm sm:rounded-[2rem] sm:p-6">
            <p className="mb-2 truncate text-[9px] font-black uppercase tracking-widest text-slate-400 italic sm:mb-3 sm:text-[10px]">Missed</p>
            <p className="text-2xl font-black tracking-tighter text-slate-900 tabular-nums sm:text-5xl">{missedCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-blue-500/5 md:p-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {missedCount > 0 ? (
              <XCircle size={18} className="text-red-400" />
            ) : (
              <CheckCircle2 size={18} className="text-blue-500" />
            )}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Missed Answers</h4>
              <p className="mt-1 text-sm font-medium text-slate-400 italic">
                {missedCount > 0 ? 'Review these before your next try.' : 'Great work. You did not miss any answers.'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {missedCount} missed
          </span>
        </div>

        {wrongAnswers && wrongAnswers.length > 0 && (
          <ol className="grid grid-cols-1 gap-4">
            {wrongAnswers.map((answer, index) => (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="grid min-w-0 gap-5 rounded-[2rem] border border-slate-100 bg-slate-50/50 p-5 md:grid-cols-[auto_1fr] md:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-red-500 shadow-sm">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="break-words text-base font-black leading-snug tracking-tight text-slate-900 [overflow-wrap:anywhere] md:text-lg">
                    {answer.question}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-red-100 bg-red-50 p-4">
                      <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-red-400">You chose</p>
                      <p className="break-words text-sm font-bold leading-relaxed text-red-600 [overflow-wrap:anywhere]">{answer.yourAnswer}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-blue-400">Right answer</p>
                      <p className="break-words text-sm font-bold leading-relaxed text-blue-600 [overflow-wrap:anywhere]">{answer.correctAnswer}</p>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </motion.div>
  );
};

export default ActionResult;
