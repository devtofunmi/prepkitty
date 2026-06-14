
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  const passwordStrength = password ? zxcvbn(password).score : 0;

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

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsCredentialsLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      toast.error('Password is too weak.');
      setIsCredentialsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message || 'Something went wrong.');
        return;
      }

      router.push('/check-email');
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-slate-700';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-lime-500';
      default: return 'bg-slate-700';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Secure';
      default: return '';
    }
  };

  return (
    <div className="h-screen flex font-sans bg-white overflow-hidden">
      <Head>
        <title>Sign Up - PrepKitty</title>
      </Head>

      {/* LEFT SIDE: FIXED PREPKITTY BRAND */}
      <div className="hidden lg:flex w-[40%] bg-black relative flex-col justify-between p-20 text-white border-r border-white/5 h-full shrink-0">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/"><Image src="/prepkitty_logo.png" alt="PrepKitty" width={180} height={50} /></Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12">
            Building your <br />
            <span className="text-blue-500 italic underline decoration-blue-500/30 underline-offset-8">future.</span>
          </h1>

          <div className="space-y-10">
            {[
              { title: "Smart Prompts", desc: "Real industry intel, tailored for you." },
              { title: "Safe Space", desc: "No judgment, just growth and practice." }
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
          <div className="w-full max-w-[460px] relative z-10">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Registration</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">
                Start your <br />
                <span className="italic text-blue-600 underline decoration-blue-200 underline-offset-4">journey.</span>
              </h2>
              <p className="text-slate-500 font-medium italic">Create your free account to start practicing.</p>
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

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-3">Password</label>
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

                {password && (
                  <div className="px-1">
                    <div className="flex gap-1 h-1 mb-2">
                      {[0, 1, 2, 3, 4].map(s => (
                        <div key={s} className={`flex-1 rounded-full ${s <= passwordStrength ? getStrengthColor(passwordStrength) : 'bg-slate-100'} transition-all`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{getStrengthText(passwordStrength)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-medium transition-all text-lg"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isCredentialsLoading || passwordStrength < 3}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-4 text-xl group"
                >
                  {isCredentialsLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <>Create Free Account <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-slate-400 text-sm font-medium italic">Already a member?</p>
              <Link href="/login" className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline underline-offset-4">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-center" />
    </div>
  );
}
