
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckEmailPage = () => {
  return (
    <div className="h-screen flex font-sans bg-white overflow-hidden">
      <Head>
        <title>Check Your Email - PrepKitty</title>
      </Head>

      {/* LEFT SIDE: FIXED BRANDING */}
      <div className="hidden lg:flex w-[40%] bg-black relative flex-col justify-between p-20 text-white border-r border-white/5 h-full shrink-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/"><Image src="/prepkitty_logo.png" alt="PrepKitty" width={180} height={50} /></Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12">
            Almost <br />
            <span className="text-blue-500 italic underline decoration-blue-500/30 underline-offset-8">there.</span>
          </h1>

          <div className="space-y-10">
            {[
              { title: "Secure Access", desc: "Verifying your identity for safety." },
              { title: "Instant Setup", desc: "Dashboard ready once you confirm." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="font-black text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </div>

      {/* RIGHT SIDE: STATUS CONTENT */}
      <div className="flex-1 bg-slate-50 lg:bg-white overflow-y-auto relative h-full">
        <div className="min-h-full flex items-center justify-center p-8 md:p-20">
          <div className="w-full max-w-[480px] relative z-10 text-center lg:text-left">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 rounded-[2rem] bg-blue-600/5 border border-blue-600/10 flex items-center justify-center mb-10 mx-auto lg:mx-0">
                <Mail className="text-blue-600" size={40} />
              </div>

              <div className="mb-12">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                  <div className="w-8 h-px bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Verify Identity</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                  Check your <br />
                  <span className="italic text-blue-600 underline decoration-blue-100 underline-offset-4">inbox.</span>
                </h2>
                <p className="text-slate-500 text-xl font-medium italic leading-relaxed">
                  We&apos;ve sent a verification link to your email. Click it to activate your constant practice environment.
                </p>
              </div>

              <div className="space-y-6">
                <Link
                  href="/login"
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-4 text-lg group"
                >
                  Back to Login <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-slate-400 text-sm font-medium italic text-center lg:text-left">
                  Didn&apos;t receive it? Check your spam folder or return to signup.
                </p>
              </div>
            </motion.div>

            <div className="mt-20 pt-10 border-t border-slate-100 hidden lg:block">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">PrepKitty Confidential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;
