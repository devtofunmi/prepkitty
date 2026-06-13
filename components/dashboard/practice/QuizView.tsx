
import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

interface QuizViewProps {
  quizData: QuizData;
  currentQuestionNumber: number;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  sendUserResponse: () => void;
  isGenerating: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ quizData, currentQuestionNumber, selectedOption, setSelectedOption, sendUserResponse, isGenerating }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto pb-10">
      <motion.div 
        key={currentQuestionNumber}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-5 text-left bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-500/5 sm:p-6 md:p-8"
      >
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 shrink-0 rounded-2xl bg-slate-950 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-slate-950/15 sm:h-12 sm:w-12">
                {currentQuestionNumber + 1}
             </div>
             <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${((currentQuestionNumber + 1) / 10) * 100}%` }} />
             </div>
             <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{currentQuestionNumber + 1}/10</span>
          </div>
          <h2 className="break-words text-xl font-black text-slate-950 tracking-tight leading-tight [overflow-wrap:anywhere] sm:text-2xl md:text-3xl">{quizData.question}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
          {Object.entries(quizData.options).map(([key, value]) => (
            <motion.label 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              key={key} 
              className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-3xl border-2 p-4 transition-all sm:items-center sm:gap-5 sm:p-5 ${
                selectedOption === key 
                  ? 'border-blue-600 bg-blue-50 shadow-[0_14px_35px_rgba(37,99,235,0.12)]' 
                  : 'border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white'
              }`}
            >
              <div className={`w-9 h-9 shrink-0 rounded-full border-2 flex items-center justify-center font-black text-xs transition-colors ${
                selectedOption === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-400'
              }`}>
                {key}
              </div>
              <input
                type="radio"
                name="quizOption"
                value={key}
                checked={selectedOption === key}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="hidden"
              />
              <span className={`min-w-0 break-words text-sm font-bold leading-relaxed tracking-tight [overflow-wrap:anywhere] sm:text-base ${selectedOption === key ? 'text-slate-950' : 'text-slate-600'}`}>{value}</span>
            </motion.label>
          ))}
        </div>

        <button
          onClick={sendUserResponse}
          disabled={isGenerating || !selectedOption}
          className="w-full py-5 rounded-2xl bg-slate-950 text-white font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/15 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={22} /> : (
            <>
              Next <ArrowRight size={20} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default QuizView;
