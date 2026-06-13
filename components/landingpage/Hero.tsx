
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

/**
 * HERO DIAGRAM (Updated to match "Ace Your Next Interview")
 * Represents success and clarity - a rising geometric star/sunburst.
 */
const HeroDiagram = () => (
  <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
    
    <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      {/* Central Radiating Success Element */}
      <motion.circle 
        cx="200" cy="200" r="10" fill="#3b82f6"
        animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        return (
          <motion.line
            key={i}
            x1="200" y1="200"
            x2={200 + Math.cos(angle) * 160}
            y2={200 + Math.sin(angle) * 160}
            stroke={i % 2 === 0 ? "#3b82f6" : "#bef264"}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
          />
        );
      })}

      {/* Floating Sparkles of achievement */}
      {[...Array(8)].map((_, i) => (
        <motion.path
          key={i}
          d="M0 4L1.5 6L4 6.5L2 8L2.5 10.5L0 9L-2.5 10.5L-2 8L-4 6.5L-1.5 6L0 4Z"
          fill="#bef264"
          initial={{ 
            x: 200 + (Math.random() - 0.5) * 200, 
            y: 200 + (Math.random() - 0.5) * 200,
            scale: 0,
            opacity: 0
          }}
          animate={{ 
            y: "-=30",
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          style={{ transformOrigin: "center" }}
        />
      ))}

      {/* Geometric Frame */}
      <motion.rect
        x="60" y="60" width="280" height="280"
        rx="20"
        stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
        animate={{ rotate: 180 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </div>
);

export const Hero = () => {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Consistent Background Dot Grid */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          {/* Tag removed as requested */}
          <h1 className="text-5xl md:text-8xl font-black leading-[0.85] mb-10 text-slate-900 tracking-tighter">
            Ace your <br />
            <span className="italic text-blue-600">next interview.</span>
          </h1>

          <p className="text-lg md:text-2xl font-medium text-slate-500 mb-12 max-w-xl mx-auto md:mx-0 leading-relaxed">
            PrepKitty helps you master high-stakes interviews in top industries. Get instant, objective feedback in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start items-center">
            {isLoggedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-5 bg-blue-500 text-white font-black rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 text-lg md:text-xl">
                  Go to Dashboard <ArrowRight size={22} />
                </button>
              </Link>
            ) : (
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-5 bg-blue-500 text-white font-black rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 text-lg md:text-xl">
                  Start Practicing Free <ArrowRight size={22} />
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="relative w-full"
        >
          <HeroDiagram />
        </motion.div>
      </div>
    </section>
  );
};
