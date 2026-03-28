import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardInfo } from '../../services/api';
import { ShieldAlert, AlertOctagon, Monitor, Zap, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const SecurityAlerts = () => {
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
            <p className="text-slate-400 font-bold uppercase text-[10px]">Loading report...</p>
        </div>
    );

    const { recentInterviews } = data;
    const alertInterviews = recentInterviews.filter(int => int.alerts && int.alerts.length > 0);

    return (
        <div className="animate-slide-up space-y-10 p-10 max-w-7xl">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3 tracking-tight">
                        Rules Check
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-full border border-rose-100/50 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span> Live Report
                        </span>
                    </h2>
                    <p className="text-slate-500 font-bold">Review any warnings recorded during your sessions.</p>
                </div>
            </div>

            {/* Total Alert Summary Stat */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-8 group">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-900 mb-1">Total Session Warnings</h3>
                    <p className="text-slate-400 font-bold">Warnings include tab switching, resizing windows, or looking away.</p>
                </div>
                <div className="bg-rose-600 text-white px-8 py-5 rounded-3xl text-center min-w-[150px] shadow-lg shadow-rose-200">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Total Warnings</p>
                    <span className="text-4xl font-black">{alertInterviews.reduce((acc, curr) => acc + curr.alerts.length, 0)}</span>
                </div>
            </div>

            {/* Alert List */}
            <div className="space-y-8">
                {alertInterviews.length === 0 ? (
                    <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-[3rem] p-24 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm scale-110">
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Focus Level: 100%</h3>
                        <p className="text-slate-500 font-bold max-w-sm mx-auto">No warnings detected. You maintained perfect focus in all sessions.</p>
                    </div>
                ) : (
                    alertInterviews.map((int) => (
                        <div key={int.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] overflow-hidden">
                            <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-slate-100 uppercase">
                                        {int.domain[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{int.domain} Session</h4>
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                            <Calendar size={12} /> {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(int.createdAt))} at {new Date(int.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-rose-50 text-rose-500 px-5 py-2 rounded-2xl border border-rose-100/50 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <AlertOctagon size={14} /> {int.alerts.length} Warnings Found
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {int.alerts.map((alert, idx) => (
                                        <div key={idx} className="bg-gray-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group overflow-hidden hover:bg-white hover:border-rose-200 transition-all duration-300">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                                <Zap className="w-10 h-10 text-rose-500" />
                                            </div>
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-rose-500 font-black text-lg leading-none">
                                                    !
                                                </div>
                                                <div className="flex-grow pt-1">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Alert Type</p>
                                                    <p className="font-black text-slate-900 text-lg leading-none">Focus Warning</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recorded Time</span>
                                                <span className="text-xs font-black text-slate-900 border b-slate-100 px-2 py-0.5 rounded-lg bg-white">
                                                    {new Date(alert.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 flex justify-end">
                                    <button onClick={() => navigate(`/results/${int.id}`)} className="flex items-center gap-2 text-indigo-600 font-extrabold hover:translate-x-1 transition-transform text-sm">
                                        View Full Report <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SecurityAlerts;
