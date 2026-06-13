
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

export const CTA = () => {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  return (
    <section id="cta" className="relative py-24 md:py-40 bg-slate-50">
      {/* Background patterns - Consistent dot grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-neutral-900 rounded-[2rem] md:rounded-[3rem] py-10 p-8 md:p-24 overflow-hidden border border-white/5"
        >
          {/* Subtle Grid Texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
            {/* Left Column: Text */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 md:mb-10">
                Land your <br className="hidden md:block" />
                <span className="italic text-blue-400">dream job.</span>
              </h2>

              <p className="text-lg md:text-xl text-slate-400 max-w-md mx-auto lg:mx-0 leading-relaxed mb-10 md:mb-12">
                Start practicing with PrepKitty today. Build your confidence and refine your interview technique with our simulations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link href={isLoggedIn ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-5 bg-blue-500 text-white font-black rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all text-lg md:text-xl shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3">
                    {isLoggedIn ? "Go to Dashboard" : "Get started free"} <ArrowRight size={22} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: Key Benefits (Stack on mobile, Grid on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 md:mb-6">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-white font-black text-lg md:text-xl mb-2">No Credit Card</h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">Start your practice session instantly without any friction.</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm sm:mt-8"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-4 md:mb-6">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-white font-black text-lg md:text-xl mb-2">Personalized</h4>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">AI analysis tailored to your specific industry and resume.</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
