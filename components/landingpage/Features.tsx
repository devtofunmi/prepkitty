
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * FEATURE DIAGRAMS (Code-based SVG Abstract Elements)
 */

const VoiceChatDiagram = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
    <svg width="240" height="120" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[...Array(20)].map((_, i) => (
        <motion.rect
          key={i}
          initial={{ height: 10 }}
          animate={{ height: [10, 40 + Math.random() * 60, 10] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
          x={10 + i * 11}
          y={60}
          width="4"
          height="100"
          rx="2"
          fill={i % 2 === 0 ? "#3b82f6" : "#bef264"}
          className="origin-center"
          style={{ transform: "translateY(-50%)" }}
        />
      ))}
    </svg>
  </div>
);

const InterviewerDiagram = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle 
        cx="100" cy="100" r="40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5"
        animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle 
        cx="100" cy="100" r="70" stroke="#bef264" strokeWidth="1" strokeDasharray="10 10"
        animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <circle cx="100" cy="100" r="20" fill="#0f172a" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.circle
          key={i}
          cx={100 + Math.cos(angle * Math.PI / 180) * 70}
          cy={100 + Math.sin(angle * Math.PI / 180) * 70}
          r="6"
          fill={i % 2 === 0 ? "#3b82f6" : "#bef264"}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  </div>
);

const FeedbackDiagram = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-48 h-48 rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center">
       <motion.div 
         animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 3, repeat: Infinity }}
         className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white"
       >
          <div className="flex gap-1">
             <div className="w-1 h-8 bg-white/20" />
             <div className="w-1 h-12 bg-white/50" />
             <div className="w-1 h-6 bg-white/80" />
          </div>
       </motion.div>
    </div>
  </div>
);

const ProgressDiagram = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M20 160 L60 120 L100 140 L140 80 L180 100"
        stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <circle cx="180" cy="100" r="8" fill="#bef264" />
      <motion.circle
        cx="180" cy="100" r="15" stroke="#bef264" strokeWidth="2"
        animate={{ scale: [1, 2], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  </div>
);

const features = [
  {
    title: "Voice chat",
    description: "Our realistic voice chat feels just like a real interview. Practice your tone, pacing, and confidence in a safe space.",
    diagram: <VoiceChatDiagram />,
    color: "bg-blue-600",
    textColor: "text-lime-300",
    buttonColor: "bg-lime-400 text-black"
  },
  {
    title: "Powerful interviewer",
    description: "Our AI interviewer will question you on everything from job-specific technicalities to obscure items on your résumé.",
    diagram: <InterviewerDiagram />,
    color: "bg-black",
    textColor: "text-blue-400",
    buttonColor: "bg-blue-500 text-white"
  },
  {
    title: "Constructive feedback",
    description: "Get honest, objective, and constructive feedback from our intelligent models to refine your answers.",
    diagram: <FeedbackDiagram />,
    color: "bg-blue-500",
    textColor: "text-white",
    buttonColor: "bg-white text-blue-600"
  },
  {
    title: "Get better",
    description: "Work your way up from easy to hard mode, mastering each stage of your career transition.",
    diagram: <ProgressDiagram />,
    color: "bg-lime-400",
    textColor: "text-neutral-900",
    buttonColor: "bg-neutral-900 text-white"
  }
];

const prompts = [
  { industry: "Banking", text: "Explain how KYC and AML processes work in complex cross-border transactions.", light: "bg-blue-50 text-blue-700" },
  { industry: "Tech", text: "How would you handle a production outage while being grilled by a CTO?", light: "bg-neutral-100 text-neutral-800" },
  { industry: "Fintech", text: "Design a secure, scalable payment flow for a multi-tenant neobank.", light: "bg-lime-50 text-lime-700" },
  { industry: "Legal", text: "Explain the implications of GDPR on non-EU based data processors.", light: "bg-indigo-50 text-indigo-700" },
];

export const Features = () => {
  return (
    <section id="features" className="relative">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className={`py-24 md:py-40 ${feature.color} relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 md:gap-24 items-center`}>

              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 text-center lg:text-left"
              >
                <div className={`text-5xl md:text-8xl font-black mb-10 leading-[0.85] flex flex-col tracking-tighter ${feature.textColor}`}>
                  <span>Real</span>
                  <span className="italic">{feature.title}</span>
                </div>

                <p className={`text-lg md:text-2xl font-medium mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed ${feature.color.includes('lime') ? 'text-black/70' : 'text-white/80'}`}>
                  {feature.description}
                </p>

                <Link href="/signup" className="mx-auto lg:mx-0">
                  <button className={`px-10 py-5 rounded-full font-black hover:scale-105 active:scale-95 transition-all text-lg shadow-2xl flex items-center justify-center gap-3 ${feature.buttonColor}`}>
                    Get started free <ArrowRight size={22} />
                  </button>
                </Link>
              </motion.div>

              {/* Diagram block */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-full lg:w-1/2 min-h-[300px] md:min-h-[400px] flex items-center justify-center"
              >
                 <div className="relative w-full max-w-md aspect-square bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center justify-center p-12">
                     {feature.diagram}
                 </div>
              </motion.div>

            </div>
          </div>
        </div>
      ))}

      {/* Prompts Section - Removed OVERFLOW-HIDDEN to let sticky work */}
      <div className="py-24 md:py-40 bg-slate-50 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

            <div className="lg:w-[38%] shrink-0 lg:sticky lg:top-40 h-fit">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                Sample<br />
                <span className="text-slate-300 italic">prompts.</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-sm font-medium">
                We use real-world industry intelligence to push your limits and prepare you for anything.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-6 w-full">
              {prompts.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-3xl border border-slate-200 p-8 md:p-10 hover:shadow-2xl transition-all"
                >
                   <div className="flex items-center justify-between mb-6">
                      <span className={`inline-block px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${p.light}`}>
                        {p.industry}
                      </span>
                   </div>
                   <p className="text-slate-900 text-xl md:text-2xl font-bold leading-snug">
                     &quot;{p.text}&quot;
                   </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
