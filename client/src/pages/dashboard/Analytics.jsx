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
            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Checking your progress</p>
        </div>
    );

    const { performanceData, domainData, stats } = data;

    const skills = [
        { name: 'Logic & Reasoning', score: (stats.avgScore || 0) * 10, color: 'indigo' },
        { name: 'Speech & Clarity', score: 85, color: 'emerald' },
        { name: 'Confidence Level', score: (stats.avgConfidence || 0) * 10, color: 'blue' },
        { name: 'Behavioral Merit', score: (stats.avgBehavior || 0) * 10, color: 'slate' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-10 p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Progress Insights</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">A comprehensive look at your technical evolution.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Growth Over Time */}
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/30">
                        <TrendingUp className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Performance Arc</h3>
                        <p className="text-sm font-medium text-slate-400 mt-0.5">Your score history across all attempted sessions.</p>
                    </div>
                </div>

                <div className="h-[380px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorScoreV3" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} dy={15} />
                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '12px' }}
                                itemStyle={{ color: '#4f46e5', fontWeight: '600', fontSize: '13px' }}
                                cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreV3)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lower Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Domain Breakdown */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/30">
                            <Target className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Domain Proficiency</h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Comparing your skills across topics.</p>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={domainData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} dy={10} />
                                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 12 }}
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
                                />
                                <Bar dataKey="avgScore" barSize={32} radius={[6, 6, 6, 6]}>
                                    {domainData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a5b4fc'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vertical Skills Breakdown */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/30">
                            <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Soft Skill Analysis</h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">Evaluation of non-technical attributes.</p>
                        </div>
                    </div>

                    <div className="space-y-8 px-2">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{skill.name}</span>
                                    <span className="text-sm font-bold text-slate-400">{skill.score}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                                    <div
                                        className={`h-full bg-${skill.color}-500 rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${skill.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed text-center italic">
                            Aggregate data from {stats.totalInterviews} sessions. 
                            Best technical record: <span className="text-indigo-600">{stats.bestScore}/10</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
