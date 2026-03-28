import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInfo } from '../../services/api';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Activity, Star, Calendar, PieChart, TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const Analytics = () => {
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
            <p className="text-slate-400 font-bold uppercase text-[10px]">Checking your progress...</p>
        </div>
    );

    const { performanceData, domainData, stats } = data;

    // Simple skill levels for easy understanding
    const skills = [
        { name: 'Logic & Reasoning', score: (stats.avgScore || 0) * 10, color: 'bg-indigo-500' },
        { name: 'Speech & Clarity', score: 85, color: 'bg-purple-500' },
        { name: 'Confidence Level', score: (stats.avgConfidence || 0) * 10, color: 'bg-emerald-500' },
        { name: 'Behavioral Merit', score: (stats.avgBehavior || 0) * 10, color: 'bg-amber-500' },
    ];

    return (
        <div className="animate-slide-up space-y-10 p-10 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">My Progress</h2>
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Detailed look at your performance over time.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Main Growth Tracker */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">Score History</h3>
                        <p className="text-sm font-bold text-slate-400">Your performance across all sessions.</p>
                    </div>
                </div>

                <div className="h-[350px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScoreV2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} dy={15} />
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '12px' }}
                                itemStyle={{ color: '#4f46e5', fontWeight: '900', fontSize: '14px' }}
                                cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScoreV2)" activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Topic Scores */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100/50">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Scores by Topic</h3>
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={domainData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} dy={10} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '900' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 12 }}
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="avgScore" barSize={32} radius={[8, 8, 8, 8]} fill="#6366f1">
                                    {domainData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Bars - Simpler than Radar */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                            <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Skill Breakdown</h3>
                    </div>

                    <div className="space-y-8">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-700">{skill.name}</span>
                                    <span className="text-xs font-black text-slate-400">{skill.score}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                    <div
                                        className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                                        style={{ width: `${skill.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 leading-relaxed text-center">
                            Based on your {stats.totalInterviews} sessions. Your best score is <span className="text-emerald-600">{stats.bestScore}/10</span>. Keep improving!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
