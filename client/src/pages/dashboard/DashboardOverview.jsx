import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInfo } from '../../services/api';
import { Users, Award, TrendingUp, AlertOctagon, Plus, Calendar, Activity, Zap, Star, Monitor, ShieldAlert, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DashboardOverview = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDB = async () => {
            try {
                const res = await getDashboardInfo();
                setData(res.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) navigate('/login');
            }
        };
        fetchDB();
    }, [navigate]);

    if (!data) return (
        <div className="h-full flex flex-col items-center justify-center p-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Loading Dashboard...</p>
        </div>
    );

    const { stats, recentInterviews, performanceData } = data;

    const cards = [
        { title: "Interviews Done", value: stats.totalInterviews, desc: "Total sessions", icon: <Users className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50/50" },
        { title: "Average Score", value: `${stats.avgScore}/10`, desc: "Overall performance", icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50/50" },
        { title: "Best Score", value: `${stats.bestScore}/10`, desc: "Your top record", icon: <Award className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50/50" },
        { title: "Rules Check", value: stats.totalAlerts, desc: "Total warnings", icon: <AlertOctagon className="w-5 h-5 text-rose-600" />, bg: "bg-rose-50/50" },
    ];

    return (
        <div className="animate-slide-up space-y-10 p-10 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">My Dashboard</h2>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Check your progress and scores here.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/start')}
                    className="group flex items-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black hover:-translate-y-1 transition-all"
                >
                    <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    New Interview
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((s, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_60px_rgba(0,0,0,0.02)] transition-all group relative overflow-hidden">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${s.bg} shadow-sm group-hover:scale-110 transition-transform`}>{s.icon}</div>
                            <div>
                                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{s.title}</h4>
                                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Simplified Growth Chart */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.02)] relative">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-1">Score History</h3>
                            <p className="text-xs font-bold text-slate-400">See your progress over time.</p>
                        </div>
                        <button onClick={() => navigate('/dashboard/analytics')} className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">View Full Stats</button>
                    </div>

                    <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} dy={10} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                                <Tooltip
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '12px' }}
                                    itemStyle={{ fontWeight: '900', color: '#4f46e5' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Info Card or Tip Section */}
                <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col justify-between group overflow-hidden relative text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform">
                            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-black mb-4 leading-tight">Your best is yet to come.</h3>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed">Each session helps you get better. Check your reports to see where you can improve.</p>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard/history')}
                        className="relative z-10 mt-10 bg-white text-slate-900 px-8 py-4 rounded-2xl flex items-center justify-between text-[11px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all group/btn"
                    >
                        View Reports
                        <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                </div>
            </div>

            {/* Quick Session Table (Condensed) */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-10 py-7 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">Recent Interviews</h3>
                    <button onClick={() => navigate('/dashboard/history')} className="text-indigo-600 font-black text-[10px] uppercase hover:underline">Full History</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-50">
                            {recentInterviews.slice(0, 3).map((int, idx) => (
                                <tr key={idx} onClick={() => navigate(`/results/${int.id}`)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm border border-indigo-100/50 shadow-inner group-hover:scale-110 transition-transform">
                                                    {int.domain[0].toUpperCase()}
                                                </div>
                                                <span className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors uppercase truncate max-w-[150px]">{int.domain}</span>
                                            </div>
                                            {int.personality?.emotionSummary && (
                                                <span className="hidden lg:inline-flex items-center px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-black/10">
                                                    <Activity className="w-2.5 h-2.5 mr-2 text-indigo-400" />
                                                    {int.personality.emotionSummary}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="text-[11px] text-slate-400 font-black uppercase tracking-[0.1em]">{new Date(int.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-black text-slate-800">
                                            <Star size={12} className="text-amber-400 fill-amber-400" />
                                            {int.totalScore}/10
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
