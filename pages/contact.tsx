
import Head from "next/head";
import { Header, Footer } from "../components/landingpage";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Head>
        <title>Contact Us - PrepKitty</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
              Get in <br />
              <span className="italic text-blue-600">touch.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-12">
              Have a question or feedback? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="space-y-12">
            <section className="bg-white p-10 rounded-3xl border border-slate-200">
              <h3 className="text-slate-900 font-black text-xl mb-4">Email</h3>
              <p className="text-slate-500 text-lg mb-8">Reach out for any feedback or questions regarding the platform.</p>
              <a href="mailto:prepkitty729@gmail.com" className="text-blue-600 text-2xl font-bold hover:underline">prepkitty729@gmail.com</a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
