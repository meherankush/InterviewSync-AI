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
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading Dashboard</p>
        </div>
    );

    const { stats, recentInterviews, performanceData } = data;

    const cards = [
        { title: "Sessions Done", value: stats.totalInterviews, icon: <Users className="w-5 h-5" />, color: "indigo" },
        { title: "Average Score", value: `${stats.avgScore}/10`, icon: <TrendingUp className="w-5 h-5" />, color: "blue" },
        { title: "Best Attempt", value: `${stats.bestScore}/10`, icon: <Award className="w-5 h-5" />, color: "emerald" },
        { title: "Integrity", value: stats.totalAlerts, icon: <ShieldAlert className="w-5 h-5" />, color: "slate" },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-10 p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Performance</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Review your progress and improve your technical skills.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/start')}
                    className="group flex items-center bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300"
                >
                    <Plus className="w-4 h-4 mr-3" />
                    New Session
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((s, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                        <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl bg-${s.color}-50 text-${s.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                {s.icon}
                            </div>
                            <div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{s.title}</h4>
                                <div className="text-2xl font-bold text-slate-900 tracking-tight">{s.value}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Score History</h3>
                            <p className="text-xs font-medium text-slate-400 mt-1">Consistency is key to your success.</p>
                        </div>
                        <button onClick={() => navigate('/dashboard/analytics')} className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">Detailed Stats</button>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} dy={10} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                                <Tooltip
                                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '12px' }}
                                    itemStyle={{ fontWeight: '600', color: '#4f46e5', fontSize: '12px' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sidebar Tip */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col justify-between group relative overflow-hidden text-white shadow-2xl">
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-6 transition-transform duration-500">
                            <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 leading-tight">Master your craft.</h3>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed">Regular practice helps you articulate complex technical concepts with ease and confidence.</p>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard/history')}
                        className="relative z-10 mt-10 bg-white text-slate-900 px-8 py-4 rounded-2xl flex items-center justify-between text-[11px] font-bold uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all duration-300 group/btn"
                    >
                        Review History
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_60px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Recent Sessions</h3>
                    <button onClick={() => navigate('/dashboard/history')} className="text-indigo-600 font-bold text-[10px] uppercase hover:underline tracking-widest">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-50">
                            {recentInterviews.slice(0, 3).map((int, idx) => (
                                <tr key={idx} onClick={() => navigate(`/results/${int.id}`)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <div className="w-11 h-11 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-bold text-sm border border-slate-100 shadow-sm group-hover:bg-white group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-300">
                                                {int.domain[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{int.domain}</span>
                                                {int.personality?.emotionSummary && (
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Activity className="w-3 h-3 text-emerald-500" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{int.personality.emotionSummary}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider">{new Date(int.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-right">
                                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-800">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            {int.totalScore}<span className="text-[10px] text-slate-300">/10</span>
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
