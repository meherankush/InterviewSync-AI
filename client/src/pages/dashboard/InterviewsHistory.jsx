import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInfo } from '../../services/api';
import { Calendar, Star, AlertOctagon, Zap, ChevronRight, Search, LayoutGrid, List, FileText } from 'lucide-react';

const InterviewsHistory = () => {
    const [data, setData] = useState(null);
    const [view, setView] = useState('list'); 
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
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Loading archives</p>
        </div>
    );

    const { recentInterviews } = data;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-8 p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Session Archives</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Review your performance history and progress.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => setView('list')}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {recentInterviews.length === 0 ? (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] p-24 text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <FileText className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No sessions recorded yet</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 text-sm">Your interview history will appear here once you've completed your first assessment.</p>
                    <button onClick={() => navigate('/dashboard/start')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all">Launch First Session</button>
                </div>
            ) : (
                <div className={view === 'list' ? 'bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] overflow-hidden' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                    {view === 'list' ? (
                        <div className="overflow-x-auto px-4 py-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-6">Knowledge Domain</th>
                                        <th className="px-8 py-6">Date Attempted</th>
                                        <th className="px-8 py-6">Performance</th>
                                        <th className="px-8 py-6">Integrity Status</th>
                                        <th className="px-8 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentInterviews.map((int, idx) => (
                                        <tr key={idx} onClick={() => navigate(`/results/${int.id}`)} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all font-bold">
                                                        {int.domain[0]}
                                                    </div>
                                                    <div className="font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{int.domain}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                                    <Calendar size={14} className="opacity-50" />
                                                    {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(int.createdAt))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100">
                                                    <Star size={13} className="text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-bold text-slate-700">{int.totalScore}<span className="text-slate-400 font-medium">/10</span></span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                {int.alertCount > 0 ? (
                                                    <div className="inline-flex items-center gap-2 text-rose-600 font-bold text-[10px] bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100/50 uppercase tracking-widest">
                                                        <AlertOctagon size={12} />
                                                        {int.alertCount} Issues
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50 uppercase tracking-widest">
                                                        Secure
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-slate-100">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        recentInterviews.map((int, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/results/${int.id}`)}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-110">
                                        {int.domain[0]}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                                            <Star size={18} fill="currentColor" /> {int.totalScore}/10
                                        </div>
                                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-0.5">Performance</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-indigo-600 transition-colors tracking-tight">{int.domain}</h3>
                                
                                <div className="mt-auto space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={16} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attempted</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">
                                            {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(int.createdAt))}
                                        </span>
                                    </div>

                                    <button className="w-full flex items-center justify-between bg-white border border-slate-100 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 rounded-2xl px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm hover:shadow-indigo-100">
                                        View Analysis <ChevronRight size={16} className="opacity-50" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default InterviewsHistory;
