
import React, { useMemo } from 'react';
import { BrainCircuit, MessageSquare } from 'lucide-react';

interface PracticeModeSwitcherProps {
  practiceMode: string;
  setPracticeMode: (mode: string) => void;
}

const PracticeModeSwitcher: React.FC<PracticeModeSwitcherProps> = ({ practiceMode, setPracticeMode }) => {
  const tabs = useMemo(
    () => [
      { id: 'chat', name: 'Interview', icon: MessageSquare },
      { id: 'quiz', name: 'Quiz', icon: BrainCircuit },
    ],
    []
  );

  return (
    <div className="flex justify-center md:justify-end">
      <div className="grid w-full max-w-md grid-cols-2 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center justify-center gap-3 rounded-[1.5rem] border px-5 py-4 text-sm font-black transition-all active:scale-95 ${
              practiceMode === tab.id
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'border-slate-100 bg-white text-slate-500 hover:border-blue-100 hover:text-slate-900'
            }`}
            onClick={() => setPracticeMode(tab.id)}
          >
            <tab.icon size={18} /> {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PracticeModeSwitcher;
