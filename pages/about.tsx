
import Head from "next/head";
import { Header, Footer } from "../components/landingpage";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Head>
        <title>About Us - PrepKitty</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
              About <br />
              <span className="italic text-blue-600">PrepKitty.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
              A simple platform for constant interview practice.
            </p>
          </motion.div>

          <div className="space-y-12 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">The Mission</h2>
              <p>Our mission is to help everyone get better in interviews with constant practice. We believe that regular simulation is the most effective way to build confidence and refine your answers.</p>
            </section>
            
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">The Goal</h2>
              <p>PrepKitty provides a straightforward space where you can practice industry-specific questions and receive objective feedback, helping you prepare for real-world scenarios without the pressure of a real interview.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
