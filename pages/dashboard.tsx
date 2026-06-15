
import Head from "next/head";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Loader2, ArrowRight, Trophy, Clock, Target } from 'lucide-react';
import Layout from '../components/dashboard/Layout';
import Link from 'next/link';
import DashboardAnalytics from '@/components/dashboard/DashboardAnalytics';
import LoadingScreen from '@/components/LoadingScreen';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  name?: string;
  practiceProfile?: boolean;
}

interface PracticeResult {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
  jobTitle?: string;
  mode: string;
}

interface UserData {
  user: User;
}

interface ScoresData {
  user: {
    practiceResults: PracticeResult[];
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();

  const { data, error } = useSWR<UserData>(
    status === 'authenticated' ? '/api/user' : null,
    fetcher
  );

  const { data: scoresData, error: scoresError } = useSWR<ScoresData>(
    status === 'authenticated' ? '/api/user-scores' : null,
    fetcher
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && data && !data.user?.practiceProfile) {
      router.replace('/onboarding');
    }
  }, [status, router, data]);

  if (status === 'loading' || !data) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  const { user } = data;
  const interviewsCompleted = scoresData?.user?.practiceResults?.length || 0;

  const averageScore =
    interviewsCompleted > 0
      ? scoresData!.user.practiceResults.reduce(
          (acc, result) => acc + result.score,
          0
        ) / interviewsCompleted
      : 0;

  return (
    <Layout title="dashboard">
      <Head>
        <title>Dashboard - PrepKitty</title>
      </Head>
      
      <div className="space-y-12 md:space-y-16">
        
        {/* HERO GREETING */}
        <section className="relative">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-slate-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Overview</span>
                 </div>
                 <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                   Welcome back, <br />
                   <span className="italic text-blue-600 underline decoration-blue-100 underline-offset-4">{user.name?.split(' ')[0] || 'User'}.</span>
                 </h1>
                 <p className="text-slate-500 font-medium italic text-lg">Your next career milestone is one practice away.</p>
              </div>
              
              <Link
                href="/practice"
                className="group relative flex items-center gap-6 bg-slate-900 text-white px-10 py-6 rounded-full hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 text-center justify-center md:justify-start"
              >
                <div className="text-left">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ready?</p>
                   <p className="font-black text-sm">Start Practice Session</p>
                </div>
                <ArrowRight size={20} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
           </div>
        </section>

        {/* ANALYTICS SECTION */}
        <section>
          <DashboardAnalytics
            results={scoresData?.user?.practiceResults || []}
            averageScore={averageScore}
            interviewsCompleted={interviewsCompleted}
          />
        </section>

        {/* RECENT ACTIVITY */}
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Clock size={18} className="text-blue-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Recent Practices</h2>
                </div>
                {interviewsCompleted > 0 && (
                <Link href="/practice" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:opacity-70 transition-opacity italic">View Practices</Link>
                )}
            </div>

            {scoresError ? (
                <div className="p-10 rounded-[2.5rem] bg-red-50 border border-red-100 text-red-500 text-sm font-medium">Error loading practices.</div>
            ) : !scoresData ? (
                <div className="flex items-center gap-3 p-10"><Loader2 className="animate-spin text-blue-500" /> <span className="text-slate-400 font-medium italic">Syncing records...</span></div>
            ) : interviewsCompleted === 0 ? (
                <div className="p-16 rounded-[2.5rem] bg-slate-50 border border-dotted border-slate-200 text-center space-y-4">
                    <p className="text-slate-400 font-medium italic">No practices found yet. Kick off your first session today.</p>
                    <Link href="/practice" className="inline-block text-blue-600 font-black uppercase text-[10px] tracking-widest underline decoration-blue-200 underline-offset-4">Get Started</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {scoresData.user.practiceResults.slice(0, 4).map((result, idx) => (
                    <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={result.id}
                    className="group flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left"
                    >
                        <div className="flex items-center gap-6">
                        <div>
                            <p className="font-black text-slate-900 tracking-tight">{result.jobTitle || 'General Practice'}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                                <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="italic">{result.mode}</span>
                            </div>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="font-black text-2xl text-slate-900">
                            {result.score}<span className="text-slate-300 text-sm font-medium">/{result.totalQuestions}</span>
                        </p>
                        </div>
                    </motion.div>
                ))}
                </div>
            )}
        </section>

        {/* TIPS SECTION */}
        <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4 italic">Professional Tip</h4>
            <p className="text-slate-500 text-lg italic font-medium leading-relaxed max-w-3xl">
                &quot;Speak clearly and pause for 2 seconds after each major point. It projects internal calm and dominance in technical discussions.&quot;
            </p>
        </section>

      </div>
    </Layout>
  );
}
