
import React from 'react';
import { Zap, X, Check } from 'lucide-react';

interface PricingModalProps {
  setShowPricingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PricingModal: React.FC<PricingModalProps> = ({ setShowPricingModal }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] p-10 max-w-lg w-full relative overflow-hidden group">
        
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

        <button
          className="absolute cursor-pointer top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
          onClick={() => setShowPricingModal(false)}
        >
          <X size={24} />
        </button>

        <div className="relative z-10 pt-10">
           <div className="flex items-center gap-3 mb-2">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">Pro Plan.</h3>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">Locked</span>
           </div>
           
           <p className="text-slate-500 font-medium italic mb-10 leading-relaxed max-w-[280px]">
              Unlock full platform capabilities and unlimited practices.
           </p>

           <div className="space-y-4 mb-12">
              {[
                "Unlimited Practice Sessions",
                "Advanced AI Behavioral Feedback",
                "History & Progress Tracking",
                "Custom Industry Profiles"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-black italic tracking-tight text-slate-900">
                   <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Check size={12} strokeWidth={4} />
                   </div>
                   {feature}
                </div>
              ))}
           </div>

           <div className="flex items-end gap-2 mb-10">
              <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">$8</p>
              <p className="text-slate-400 font-black italic mb-2 tracking-widest uppercase text-xs">/ month</p>
           </div>

           <button 
             className="w-full relative px-8 py-6 bg-slate-100 text-slate-400 rounded-[2rem] font-black italic transition-all cursor-not-allowed"
             disabled
           >
             Coming Soon
           </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;