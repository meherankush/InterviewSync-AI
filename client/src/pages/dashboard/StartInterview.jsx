import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../../services/api';
import { Code, Layout, Brain, Database, Users, Server, Clock, AlertTriangle, ArrowRight, Video, Mic, Shield, Sparkles, CheckCircle2, ChevronDown, MonitorPlay, Target, Zap } from 'lucide-react';

const StartInterview = () => {
    const [domain, setDomain] = useState('DSA');
    const [duration, setDuration] = useState(15);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStart = async () => {
        setLoading(true);
        try {
            const res = await startSession({ domain, duration });
            localStorage.setItem('currentInterview', JSON.stringify({
                session: res.data.session,
                firstQuestion: res.data.firstQuestion
            }));
            navigate('/interview-room');
        } catch (err) {
            alert('Failed to start: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    const domains = [
        { id: "DSA", name: "Data Structures", icon: <Code className="w-5 h-5" /> },
        { id: "Web Development", name: "Web Development", icon: <Layout className="w-5 h-5" /> },
        { id: "Machine Learning", name: "AI & Machine Learning", icon: <Brain className="w-5 h-5" /> },
        { id: "Data Science", name: "Data Science", icon: <Database className="w-5 h-5" /> },
        { id: "HR", name: "HR & Behavioral", icon: <Users className="w-5 h-5" /> },
        { id: "DBMS", name: "Database Systems", icon: <Server className="w-5 h-5" /> }
    ];

    const selectedDomain = domains.find(d => d.id === domain) || domains[0];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 p-8 lg:p-12 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configure Your Session</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Prepare yourself for a realistic technical assessment.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Configuration Card */}
                <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] p-10 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        
                        {/* Domain & Duration Controls */}
                        <div className="space-y-12">
                            {/* Domain Select */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Target className="w-3 h-3 text-indigo-500" /> Topic of Expertise
                                </label>
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${isDropdownOpen ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100/50' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform">
                                                {selectedDomain.icon}
                                            </div>
                                            <span className="font-bold text-slate-900 text-lg tracking-tight">{selectedDomain.name}</span>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-3xl border border-slate-100 shadow-2xl z-50 animate-in zoom-in-95 fade-in duration-200 overflow-hidden p-2">
                                            {domains.map(d => (
                                                <button
                                                    key={d.id}
                                                    onClick={() => { setDomain(d.id); setIsDropdownOpen(false); }}
                                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 group ${domain === d.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${domain === d.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                                                            {d.icon}
                                                        </div>
                                                        <span className="font-bold text-sm">{d.name}</span>
                                                    </div>
                                                    {domain === d.id && <CheckCircle2 size={16} className="mr-2" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Duration Buttons */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-emerald-500" /> Session Intensity
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { v: 10, l: "Short" },
                                        { v: 15, l: "Medium" },
                                        { v: 30, l: "Expert" }
                                    ].map(d => (
                                        <button
                                            key={d.v}
                                            onClick={() => setDuration(d.v)}
                                            className={`flex flex-col items-center justify-center py-5 rounded-3xl border transition-all duration-300 ${duration === d.v
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm'
                                                : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                                                }`}
                                        >
                                            <span className="text-2xl font-bold tracking-tight">{d.v}m</span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{d.l}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Call to Action */}
                            <button
                                onClick={handleStart}
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>Initiate Session <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>

                        {/* Rules & Guidelines */}
                        <div className="lg:border-l border-slate-100 lg:pl-16 space-y-12 py-2">
                            <div className="space-y-8">
                                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2 opacity-40">
                                    <Shield className="w-3.5 h-3.5" /> Compliance Checklist
                                </h4>
                                <div className="space-y-8">
                                    {[
                                        { icon: <Video className="w-4 h-4" />, text: "Camera presence is required throughout the session", color: "indigo" },
                                        { icon: <Mic className="w-4 h-4" />, text: "Clear audio environment for accurate voice analysis", color: "emerald" },
                                        { icon: <AlertTriangle className="w-4 h-4" />, text: "Strict zero-tolerance policy for tab switching", color: "rose" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-5 group">
                                            <div className={`w-11 h-11 bg-${item.color}-50 text-${item.color}-500 rounded-2xl flex items-center justify-center border border-${item.color}-100/50 transition-transform group-hover:scale-110`}>
                                                {item.icon}
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 tracking-tight leading-relaxed">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50/30 rounded-3xl border border-slate-50 relative overflow-hidden">
                                <div className="flex gap-5 relative z-10">
                                    <div className="shrink-0 w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed pt-1.5">
                                        Proactive behavioral tracking is enabled to provide comprehensive feedback on your personality development.
                                    </p>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartInterview;
