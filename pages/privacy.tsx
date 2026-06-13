
import Head from "next/head";
import { Header, Footer } from "../components/landingpage";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Head>
        <title>Privacy Policy - PrepKitty</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
              Privacy <br />
              <span className="italic text-blue-600">Policy.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
              We take your privacy seriously.
            </p>
          </motion.div>

          <div className="space-y-12 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">Data Use</h2>
              <p>We use your interview data strictly to generate feedback and help you track your progress. Your data is not sold to third parties.</p>
            </section>
            
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">Data Security</h2>
              <p>We use standard security measures to protect your information. Our goal is to provide a safe and private environment for your professional development.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
