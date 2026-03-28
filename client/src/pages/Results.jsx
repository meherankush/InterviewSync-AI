import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, BrainCircuit, Activity, Zap, CheckCircle2, ShieldAlert, Users } from 'lucide-react';
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
                    // Calculate avg for non-id sessions (legacy/local)
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
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-gray-50/50">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold tracking-wide">Retrieving feedback...</p>
            </div>
        );
    }

    if (error || (evaluations.length === 0 && conversation.length === 0)) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-20 bg-gray-50/50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
                    <ShieldAlert className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">It looks like this interview session was not completed or the data was lost.</p>
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-white bg-gray-900 hover:bg-gray-800 px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-0.5 group">
                    Return to Dashboard <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] pt-24 pb-20 relative overflow-hidden bg-gray-50/50">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[10%] w-[30rem] h-[30rem] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob [animation-delay:2s]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 animate-slide-up">

                {/* Hero Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white/60 p-10 text-center mb-12 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-300/30 to-emerald-300/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
                        <CheckCircle2 className="w-12 h-12 text-indigo-500 relative z-10" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Session Analysis</h1>
                    <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">Detailed breakdown of your technical performance and professional behavior.</p>

                    <div className="inline-flex flex-col items-center bg-white px-10 py-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Technical Rank</div>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-600">
                            {avgScoreVal}<span className="text-3xl text-gray-300">/10</span>
                        </div>
                    </div>
                </div>

                {/* Personality & Personality Development Section */}
                {personality && (
                    <div className="bg-slate-900 rounded-[3rem] p-10 lg:p-14 mb-16 relative overflow-hidden text-white shadow-2xl shadow-indigo-200/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -z-10"></div>
                        
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 bg-indigo-500 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Personality Analysis</h3>
                                <p className="text-indigo-300/60 font-bold text-sm">How you presented yourself during the interview.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Behavioral Rank</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-white">{(personality.behaviorScore || 0).toFixed(1)}</span>
                                    <span className="text-sm font-bold text-white/30 mb-1.5">/ 10</span>
                                </div>
                                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(personality.behaviorScore || 0) * 10}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Confidence</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-white">{(personality.confidenceScore || 0).toFixed(1)}</span>
                                    <span className="text-sm font-bold text-white/30 mb-1.5">/ 10</span>
                                </div>
                                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 delay-100" style={{ width: `${(personality.confidenceScore || 0) * 10}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Core Emotion</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <span className="text-xl font-black text-white tracking-tight">{personality.emotionSummary || "Calm"}</span>
                                </div>
                                <p className="text-[11px] font-bold text-white/40 mt-4 leading-relaxed italic">Reflects your overall tone throughout the session.</p>
                            </div>
                        </div>

                        <div className="p-8 bg-indigo-500/10 rounded-[2rem] border border-white/5 relative group">
                            <Zap className="absolute top-6 right-6 w-6 h-6 text-indigo-400 opacity-30 group-hover:opacity-100 transition-opacity" />
                            <h5 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Persona Development Advice</h5>
                            <p className="text-base font-bold text-white/80 leading-relaxed max-w-2xl">
                                {personality.behaviorFeedback || "Maintaining steady eye contact and structured pauses can further boost your professional presence."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Individual Question Breadown (Legacy Mode) */}
                {evaluations.length > 0 && (
                    <>
                        <div className="flex items-center gap-4 mb-10 px-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Question Breakdown</h3>
                        </div>

                        <div className="space-y-8 mb-16">
                            {evaluations.map((ev, idx) => {
                                return (
                                    <div key={idx} className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 group">
                                        <div className="p-10 lg:p-12">
                                            <div className="flex items-start gap-6 mb-8">
                                                <div className="shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-slate-200">
                                                    0{idx + 1}
                                                </div>
                                                <h4 className="font-black text-slate-900 text-xl leading-snug tracking-tight pt-1">{ev.question}</h4>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logic</p>
                                                    <p className="text-3xl font-black text-slate-900">{ev.result.technicalScore}<span className="text-sm text-slate-300 ml-1">/10</span></p>
                                                </div>
                                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] group-hover:bg-purple-50/50 group-hover:border-purple-100 transition-colors">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Speech</p>
                                                    <p className="text-3xl font-black text-slate-900">{ev.result.clarityScore}<span className="text-sm text-slate-300 ml-1">/10</span></p>
                                                </div>
                                                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] group-hover:bg-amber-50/50 group-hover:border-amber-100 transition-colors">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Expertise</p>
                                                    <p className="text-3xl font-black text-slate-900">{ev.result.depthScore}<span className="text-sm text-slate-300 ml-1">/10</span></p>
                                                </div>
                                            </div>

                                            <div className="bg-indigo-50/30 rounded-[2rem] p-8 border border-indigo-100/30 relative">
                                                <div className="absolute top-10 right-10 opacity-10">
                                                    <BrainCircuit className="w-12 h-12 text-indigo-600" />
                                                </div>
                                                <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Interviewer's Note</h5>
                                                <p className="text-[15px] font-bold text-slate-700 leading-relaxed max-w-2xl">{ev.result.feedback}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Transcript */}
                {conversation.length > 0 && (
                    <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] mb-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Full Transcript</h3>
                        </div>
                        <div className="space-y-6">
                            {conversation.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-8 py-5 rounded-[2rem] ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-200'
                                        : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Security Alerts */}
                {id && (
                    <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.03)] mb-12 overflow-hidden relative group">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Integrity Check</h3>
                        </div>

                        <div className="space-y-6">
                            {alerts.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-emerald-100 rounded-[2.5rem] bg-emerald-50/30 text-center group-hover:border-emerald-300 transition-colors">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                    <h4 className="font-black text-emerald-900 text-xl tracking-tight">Standard Behavior</h4>
                                    <p className="text-emerald-700/60 font-bold text-sm">No suspicious activity detected during the session.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {alerts.map((alert, idx) => (
                                        <div key={idx} className="flex items-start gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-rose-100 transition-all group/alert">
                                            <div className="p-3 bg-white rounded-xl shadow-sm group-hover/alert:bg-rose-50 transition-colors">
                                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-snug">{alert.message}</p>
                                                <p className="text-[10px] font-black text-rose-400 uppercase mt-2 tracking-widest">
                                                    {new Date(alert.time).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="mt-16 text-center">
                    <button onClick={() => navigate('/dashboard')} className="group inline-flex items-center justify-center bg-slate-900 text-white font-black py-6 px-12 rounded-[2.5rem] hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 uppercase text-xs tracking-[0.2em]">
                        Return to Dashboard <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
