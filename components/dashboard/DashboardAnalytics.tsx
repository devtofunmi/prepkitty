
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { Target, BarChart2, Award } from 'lucide-react';

interface PracticeResult {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

interface DashboardAnalyticsProps {
  results: PracticeResult[];
  averageScore: number;
  interviewsCompleted: number;
}

export default function DashboardAnalytics({
  results,
  averageScore,
  interviewsCompleted,
}: DashboardAnalyticsProps) {
  const chartData =
    results?.slice(-5).map((result, index) => ({
      date: new Date(result.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: result.score,
      session: index,
    })) || [];

  const progressPercent = (averageScore / 10) * 100;
  const radialData = [{ name: 'Progress', value: progressPercent }];

  // Simple improvement calc: Compare last score to second to last
  let improvementText = "Consistent";
  let improvementColor = "text-slate-400";
  if (results.length >= 2) {
      const last = results[results.length - 1].score;
      const prev = results[results.length - 2].score;
      if (last > prev) {
          improvementText = `+${Math.round(((last - prev) / prev) * 100)}%`;
          improvementColor = "text-blue-600";
      } else if (last < prev) {
          improvementText = `${Math.round(((last - prev) / prev) * 100)}%`;
          improvementColor = "text-red-500";
      }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STAT 1: COMPLETED */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 relative group transition-all">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Target size={14} className="text-blue-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total Practices</h3>
              </div>
              <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                {interviewsCompleted}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-2 italic">Cumulative sessions</p>
           </div>
        </div>

        {/* STAT 2: AVERAGE */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 relative group transition-all">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Award size={14} className="text-blue-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Average Score</h3>
              </div>
              <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums flex items-baseline">
                {averageScore.toFixed(1)}
                <span className="text-xl text-slate-200 ml-1">/10</span>
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-2 italic">Skill calibration</p>
           </div>
        </div>

        {/* STAT 3: TREND */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 relative group transition-all">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <BarChart2 size={14} className="text-blue-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Improvement</h3>
              </div>
              <p className={`text-5xl font-black ${improvementColor} tracking-tighter tabular-nums`}>
                {improvementText}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-2 italic">Last 2 sessions trend</p>
           </div>
        </div>

      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Score History</h3>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trend</span>
                  </div>
               </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="session"
                    stroke="#cbd5e1"
                    fontSize={10}
                    fontFamily="inherit"
                    fontWeight="900"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => chartData[value].date}
                    dy={15}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="#cbd5e1"
                    fontSize={10}
                    fontFamily="inherit"
                    fontWeight="900"
                    axisLine={false}
                    tickLine={false}
                    dx={-15}
                  />
                  <Tooltip
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl shadow-slate-900/20 border-none outline-none">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.date}</p>
                            <p className="text-lg font-black">{payload[0].value} / 10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={5}
                    dot={{ r: 6, fill: '#fff', stroke: '#2563eb', strokeWidth: 3 }}
                    activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-[200px] text-center md:text-left">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic mb-4">Success Rate</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed italic">Your average score across all practices. Aim for 80% to be interview-ready.</p>
            </div>
            <div className="flex-1 flex justify-center items-center relative">
              <ResponsiveContainer width={220} height={220}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={20}
                  data={radialData}
                  startAngle={90}
                  endAngle={450}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: '#f8fafc' }}
                    dataKey="value"
                    cornerRadius={50}
                    fill="#2563eb"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                 <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {Math.round(progressPercent)}%
                 </p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Ready</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}