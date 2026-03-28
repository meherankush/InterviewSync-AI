import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../../services/api';
import { Code, Layout, Brain, Database, Users, Server, Clock, AlertTriangle, ArrowRight, Video, Mic, Shield, Sparkles, CheckCircle2, ChevronDown, MonitorPlay } from 'lucide-react';

const StartInterview = () => {
    const [domain, setDomain] = useState('DSA');
    const [duration, setDuration] = useState(15);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown on click outside
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
            navigate('/chat');
        } catch (err) {
            alert('Failed to start: ' + err.message);
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

    const durations = [
        { value: 10, label: "10 Min", desc: "Short" },
        { value: 15, label: "15 Min", desc: "Medium" },
        { value: 30, label: "30 Min", desc: "Long" }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-10 lg:p-16 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Interview Setup</h1>
                <p className="text-slate-500 font-bold text-base max-w-2xl">Select your topic and session time to begin.</p>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] p-10 lg:p-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Settings */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`w-full flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all duration-300 ${isDropdownOpen ? 'border-indigo-600 bg-white ring-8 ring-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                                            {selectedDomain.icon}
                                        </div>
                                        <span className="font-black text-slate-900 text-xl tracking-tight">{selectedDomain.name}</span>
                                    </div>
                                    <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 animate-in zoom-in-95 fade-in duration-200 overflow-hidden p-3">
                                        {domains.map(d => (
                                            <button
                                                key={d.id}
                                                onClick={() => { setDomain(d.id); setIsDropdownOpen(false); }}
                                                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all ${domain === d.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl ${domain === d.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        {d.icon}
                                                    </div>
                                                    <span className="font-black text-sm">{d.name}</span>
                                                </div>
                                                {domain === d.id && <CheckCircle2 size={18} className="text-indigo-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Duration</label>
                            <div className="grid grid-cols-3 gap-4">
                                {durations.map(d => (
                                    <button
                                        key={d.value}
                                        onClick={() => setDuration(d.value)}
                                        className={`flex flex-col items-center justify-center py-5 rounded-[2rem] border-2 transition-all duration-300 ${duration === d.value
                                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700'
                                            : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200'
                                            }`}
                                    >
                                        <span className="text-3xl font-black tracking-tighter">{d.value}m</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white p-6 rounded-[2.5rem] font-black uppercase text-[12px] tracking-widest flex items-center justify-center gap-5 transition-all hover:bg-black hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-slate-200"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>Start Interview Now <ArrowRight size={20} /></>
                            )}
                        </button>
                    </div>

                    {/* Rules */}
                    <div className="lg:border-l border-slate-100 lg:pl-16 space-y-12">
                        <div className="space-y-8">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Quick Rules</h4>
                            <div className="space-y-6">
                                {[
                                    { icon: <Video className="w-5 h-5 text-indigo-500" />, text: "Keep camera on always" },
                                    { icon: <Mic className="w-5 h-5 text-purple-500" />, text: "Quiet room, clear voice" },
                                    { icon: <AlertTriangle className="w-5 h-5 text-rose-500" />, text: "No tab switching allowed" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">{item.icon}</div>
                                        <p className="text-sm font-black text-slate-500 tracking-tight">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                            <div className="flex gap-5">
                                <div className="shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                                    <Shield size={24} className="text-indigo-400" />
                                </div>
                                <p className="text-[12px] font-bold text-slate-400 leading-relaxed pt-1">
                                    Our AI proctor runs in the background to ensure session integrity and provide a fair score.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartInterview;
