
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn, getSession, useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    const { email: emailFromQuery, verified, error: queryError } = router.query;
    if (verified === 'true' && typeof emailFromQuery === 'string') {
      toast.success('Email verified! You can now log in.');
      setEmail(emailFromQuery);
    }
    if (queryError) {
      toast.error(queryError);
    }
  }, [router.query]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    router.replace('/dashboard');
  }, [router, status]);

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCredentialsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Invalid credentials');
      } else if (result.error === 'EmailNotVerified') {
        toast.error('Your email is not verified.');
      } else {
        toast.error(result.error);
      }
    } else if (result?.ok) {
      const session = await getSession();
      if (session?.user?.onboardingCompleted === false) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }

    setIsCredentialsLoading(false);
  };

  return (
    <div className="h-screen flex font-sans bg-white overflow-hidden">
      <Head>
        <title>Login - PrepKitty</title>
      </Head>

      {/* LEFT SIDE: FIXED PREPKITTY BRAND */}
      <div className="hidden lg:flex w-[40%] bg-black relative flex-col justify-between p-20 text-white border-r border-white/5 h-full shrink-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/"><Image src="/prepkitty_logo.png" alt="PrepKitty" width={180} height={50} /></Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12">
            Mastering your <br />
            <span className="text-blue-500 italic underline decoration-blue-500/30 underline-offset-8">career.</span>
          </h1>

          <div className="space-y-10">
            {[
              { title: "Voice Practice", desc: "Speak naturally, get analyzed instantly." },
              { title: "Deep Insights", desc: "Detailed technical feedback for every role." }
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

      {/* RIGHT SIDE: SCROLLABLE PREPKITTY FORM */}
      <div className="flex-1 bg-slate-50 lg:bg-white overflow-y-auto relative h-full">
        <div className="min-h-full flex items-center justify-center p-8 md:p-20">
          <div className="w-full max-w-[440px] relative z-10">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Login</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                Welcome <br />
                <span className="italic text-blue-600 underline decoration-blue-200 underline-offset-4">Back.</span>
              </h2>
              <p className="text-slate-500 font-medium italic">Sign in to resume your constant practice.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</label>
                <input
                  type="email"
                  className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all text-lg"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                   <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium pr-16 transition-all text-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isCredentialsLoading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4 text-xl group"
                >
                  {isCredentialsLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <>Log in <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-slate-400 text-sm font-medium italic">New to PrepKitty?</p>
              <Link href="/signup" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline underline-offset-4">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Back Arrow for Mobile/Tablet */}
        <Link href="/" className="absolute top-12 left-12 lg:hidden flex items-center gap-2 text-slate-400">
          <ArrowRight size={20} className="rotate-180" />
        </Link>
      </div>

      <ToastContainer position="bottom-center" />
    </div>
  );
}
