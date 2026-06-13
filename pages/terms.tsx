
import Head from "next/head";
import { Header, Footer } from "../components/landingpage";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Head>
        <title>Terms of Service - PrepKitty</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
         <div className="grid lg:grid-cols-2 gap-16 items-start">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
              Terms of <br />
              <span className="italic text-blue-600">Service.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
              Terms for using the platform.
            </p>
          </motion.div>

          <div className="space-y-12 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">Platform Access</h2>
              <p>PrepKitty is currently free to use. We provide access to interview simulations and feedback tools at no cost. By using the platform, you agree to use it for personal career preparation purposes.</p>
            </section>
            
            <section>
              <h2 className="text-slate-900 font-black text-2xl uppercase tracking-widest mb-6 italic">Usage Rules</h2>
              <p>Please use the platform respectfully. We reserve the right to manage access to ensure a high-quality experience for all users.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
