import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, BrainCircuit, Activity, Zap, CheckCircle2, ShieldAlert, Users, Layout, Clock, Target } from 'lucide-react';
import { getInterviewDetails } from '../services/api';

const Results = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [evaluations, setEvaluations] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [avgScoreVal, setAvgScoreVal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [personality, setPersonality] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (id) {
                try {
                    const res = await getInterviewDetails(id);
                    setEvaluations(res.data.evaluations || []);
                    setConversation(res.data.interview.conversation || []);
                    setAlerts(res.data.interview.alerts || []);
                    setAvgScoreVal(res.data.interview.totalScore || 0);
                    setPersonality(res.data.interview.personalityDevelopment || null);
                } catch (err) {
                    console.error("Failed to fetch past results:", err);
                    setError(true);
                }
            } else {
                const resultsStr = localStorage.getItem('interviewResults');
                if (resultsStr) {
                    const parsed = JSON.parse(resultsStr);
                    setEvaluations(parsed);
                    const avg = (parsed.reduce((acc, ev) => acc + (ev.result.technicalScore + ev.result.clarityScore + ev.result.depthScore) / 3, 0) / parsed.length).toFixed(1);
                    setAvgScoreVal(avg);
                }
            }
            setLoading(false);
        };
        fetchResults();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center">Analyzing Session</p>
            </div>
        );
    }

    if (error || (evaluations.length === 0 && conversation.length === 0)) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center py-20 bg-white px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 mb-8">
                    <ShieldAlert className="w-8 h-8 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Results Found</h2>
                <p className="text-slate-500 mb-10 max-w-sm text-center font-medium">This session might be incomplete or the data is temporarily unavailable.</p>
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 group">
                    Return to Dashboard <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 bg-slate-50/30">
            <div className="max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                
                {/* Hero Header */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] p-10 lg:p-14 mb-10 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="flex-grow">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl mb-6">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Interview Completed</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Performance Review</h1>
                            <p className="text-slate-500 text-lg font-medium max-w-xl">Comprehensive AI analysis of your technical expertise and professional communication.</p>
                        </div>
                        
                        <div className="shrink-0 flex flex-col items-center justify-center p-1 bg-slate-50 rounded-[2.5rem] border border-slate-100/50 shadow-inner">
                            <div className="bg-white px-10 py-8 rounded-[2rem] shadow-sm flex flex-col items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Target className="w-3 h-3" /> Technical Score</span>
                                <div className="text-6xl font-black text-slate-900 tracking-tighter">
                                    {avgScoreVal}<span className="text-3xl text-slate-200">/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Behavioral & Personality Grid */}
                {personality && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                        <div className="lg:col-span-8 bg-slate-900 rounded-[2.5rem] p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                             <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight">Personality Insights</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Behavioral Sync</span>
                                            <span className="text-xl font-bold">{(personality.behaviorScore || 0).toFixed(1)}/10</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(personality.behaviorScore || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Confidence Index</span>
                                            <span className="text-xl font-bold">{(personality.confidenceScore || 0).toFixed(1)}/10</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(personality.confidenceScore || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 relative group">
                                    <Zap className="absolute top-8 right-8 w-5 h-5 text-indigo-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Professional Advice</h5>
                                    <p className="text-base font-medium text-slate-300 leading-relaxed">
                                        {personality.behaviorFeedback || "Maintaining steady eye contact and structured pauses can further boost your professional presence."}
                                    </p>
                                </div>
                             </div>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
                        </div>

                        <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-10 lg:p-12 border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] flex flex-col justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 border border-amber-100">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Emotion</h4>
                                <div className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{personality.emotionSummary || "Calm"}</div>
                                <p className="text-sm font-medium text-slate-400 leading-relaxed px-2">Your spoken tone accurately reflected a sense of professional composure.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Breakdown */}
                {evaluations.length > 0 && (
                    <div className="space-y-8 mb-20">
                        <div className="flex items-center gap-4 px-6 mb-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Question Analysis</h3>
                        </div>
                        
                        {evaluations.map((ev, idx) => (
                            <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition-all duration-500 group overflow-hidden">
                                <div className="p-10 lg:p-12">
                                    <div className="flex items-start gap-6 mb-10">
                                        <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-xl leading-snug tracking-tight mt-1">{ev.question}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                                        {[
                                            { label: "Technical Logic", score: ev.result.technicalScore, color: "blue" },
                                            { label: "Answer Clarity", score: ev.result.clarityScore, color: "indigo" },
                                            { label: "Subject Depth", score: ev.result.depthScore, color: "emerald" }
                                        ].map((stat, i) => (
                                            <div key={i} className={`bg-slate-50/50 border border-slate-100 p-6 rounded-2xl`}>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-bold text-slate-900">{stat.score}</span>
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">/10</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative group/note">
                                        <h5 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <BrainCircuit className="w-3 h-3" /> AI Feedback
                                        </h5>
                                        <p className="text-[15px] font-medium text-slate-600 leading-relaxed">{ev.result.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Integrity & Transcript Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Transcript Card */}
                    {conversation.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] flex flex-col max-h-[600px] overflow-hidden">
                            <div className="px-10 py-7 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Layout className="w-5 h-5 text-indigo-500" />
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Transcript</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{conversation.length} Messages</span>
                            </div>
                            <div className="flex-grow overflow-y-auto p-10 space-y-6 custom-scrollbar">
                                {conversation.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] px-6 py-4 rounded-3xl ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                            : 'bg-slate-100 text-slate-700 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Integrity Card */}
                    {id && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_50px_rgba(0,0,0,0.02)] flex flex-col h-full overflow-hidden">
                            <div className="px-10 py-7 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Integrity Check</h3>
                                </div>
                            </div>
                            <div className="p-10">
                                {alerts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-lg mb-2">Standard Behavior</h4>
                                        <p className="text-slate-400 font-medium text-sm">Session maintained high integrity standards.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {alerts.map((alert, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-5 bg-rose-50/50 rounded-2xl border border-rose-100/50 group/alert hover:bg-rose-50 transition-colors">
                                                <div className="p-2.5 bg-white rounded-xl border border-rose-200 shadow-sm text-rose-500">
                                                    <ShieldAlert className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-rose-900 leading-snug">{alert.message}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(alert.time).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center">
                    <button onClick={() => navigate('/dashboard')} className="group inline-flex items-center justify-center bg-slate-900 text-white font-bold py-5 px-10 rounded-2xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase text-xs tracking-widest">
                        Return to Dashboard <ArrowRight className="ml-4 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
