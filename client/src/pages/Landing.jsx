import React from 'react';
import { Link } from 'react-router-dom';
import { 
    CheckCircle, AlertTriangle, Video, BarChart2, BrainCircuit, 
    Mic, Lock, ShieldCheck, Zap, UserCheck, ArrowRight, PlayCircle, 
    Star, Sparkles, Layout, Globe, TrendingUp, Target, Award, Users, FileText,
    Cpu, Infinity, Activity, MessageSquare, Layers, Shield
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-white flex flex-col items-center overflow-hidden font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

            {/* 1. REFINED LIGHT HERO SECTION (Split & Compact) */}
            <section className="w-full relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50/60 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-slate-50/50 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10 w-full text-center lg:text-left">
                    <div className="lg:w-[48%] flex flex-col items-center lg:items-start animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>Next-Gen Preparation Protocol</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05] text-slate-950">
                            Architect Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400">Success.</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-500 mb-10 max-w-lg font-medium leading-relaxed opacity-90 mx-auto lg:mx-0">
                            Quantify your communication depth and technical logic within a high-fidelity AI simulation boardroom designed for excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/register" className="group flex items-center justify-center bg-indigo-600 text-white font-bold py-4.5 px-10 rounded-2xl shadow-xl shadow-indigo-100/50 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-[11px]">
                                Start Simulation
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#features" className="flex items-center justify-center bg-white border border-slate-100 text-slate-600 font-bold py-4.5 px-10 rounded-2xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-[11px]">
                                View Parameters
                            </a>
                        </div>
                    </div>

                    {/* Interactive Hero Image Module (Over-the-shoulder perspective) */}
                    <div className="lg:w-[52%] relative flex justify-center items-center animate-in fade-in slide-in-from-right-10 duration-[1200ms] w-full">
                        <div className="relative w-full max-w-2xl group">
                            <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                            <div className="relative rounded-[2.5rem] bg-indigo-50/20 backdrop-blur-3xl border border-white p-3 shadow-2xl overflow-hidden group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700">
                                <img 
                                    src="/hero-over-shoulder.png" 
                                    alt="Professional Candidate Perspective" 
                                    className="relative rounded-[2rem] w-full shadow-sm" 
                                />
                                {/* Floating Modules (Adaptive Analytics) */}
                                <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-2xl p-6 rounded-[1.8rem] border border-white shadow-xl hidden md:block animate-float">
                                    <Activity className="w-6 h-6 text-emerald-500 mb-3" />
                                    <div className="text-xl font-bold text-slate-900">98.4%</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Logic Depth</div>
                                </div>
                                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-2xl p-5 rounded-[1.8rem] border border-white shadow-xl hidden md:flex items-center gap-4 animate-float-delayed">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="pr-2 text-left">
                                        <div className="text-sm font-bold text-slate-900">Real-time</div>
                                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Analytics Feed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. STRATEGIC BENEFITS (High-Impact Trust Grid) */}
            <section className="w-full py-16 bg-slate-50/50 border-y border-slate-100 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Confidence Scale', icon: <Activity size={20} className="text-indigo-600" />, desc: 'Measure and improve your psychological delivery markers.' },
                            { title: 'Semantic Depth', icon: <BrainCircuit size={20} className="text-indigo-600" />, desc: 'Deep evaluation of technical logic and conceptual clarity.' },
                            { title: 'FAANG Standards', icon: <Target size={20} className="text-indigo-600" />, desc: 'Strict simulation matching elite industry benchmarks.' },
                            { title: 'Growth Engine', icon: <TrendingUp size={20} className="text-indigo-600" />, desc: 'Granular tracking of metrics across every session.' }
                        ].map((benefit, idx) => (
                            <div key={idx} className="group flex flex-col items-center lg:items-start text-center lg:text-left bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                                <h4 className="text-sm font-bold text-slate-950 mb-2 tracking-widest uppercase">{benefit.title}</h4>
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed opacity-80">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. CAPABILITIES GRID (Feature Intelligence Matrix) */}
            <section id="features" className="w-full py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-8 lg:px-12">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6 border border-slate-100">
                            <Cpu className="w-4 h-4" /> Intelligence Matrix
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4 tracking-tight">Precision Assessments.</h3>
                        <p className="text-base text-slate-500 font-medium leading-relaxed">High-fidelity tools designed to expose technical gaps and quantify behavioral strengths.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Logic Analysis', icon: <Layers />, desc: 'Evaluation of problem-solving approach and technical accuracy.' },
                            { title: 'Behavioral DNA', icon: <UserCheck />, desc: 'Monitoring of non-verbal cues, eye-contact, and confidence indicators.' },
                            { title: 'Voice Intelligence', icon: <Mic />, desc: 'Analysis of frequency, tone, and delivery clarity for maximum impact.' },
                            { title: 'Proctoring Core', icon: <Shield />, desc: 'Advanced monitoring to ensure integrity and professional standards.' },
                            { title: 'Semantic Feedback', icon: <MessageSquare />, desc: 'Instant, context-aware suggestions for improving technical logic.' },
                            { title: 'Unified Analytics', icon: <BarChart2 />, desc: 'Centralized dashboard tracking evolution across all domains.' }
                        ].map((feature, idx) => (
                            <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50/40 transition-all duration-500">
                                <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    {React.cloneElement(feature.icon, { size: 24 })}
                                </div>
                                <h4 className="text-xl font-bold text-slate-950 mb-4 tracking-tight">{feature.title}</h4>
                                <p className="text-slate-500 font-medium text-[13px] leading-relaxed opacity-90">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. METHODOLOGY (Simulation Protocol) */}
            <section id="how-it-works" className="w-full py-20 bg-slate-50/50 relative border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="lg:w-[45%] text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                                <Zap className="w-4 h-4" /> The Protocol
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold text-slate-950 mb-10 tracking-tight leading-[1.1]">Architecting path <br />to results.</h3>
                            
                            <div className="space-y-10">
                                {[
                                    { num: '01', title: 'Target Parameters', text: 'Select technical domains (React, Python, DSA) and adjust simulation strictness.' },
                                    { num: '02', title: 'Intelligent Session', text: 'Engage with our AI dashboard in a secure, distraction-free boardroom environment.' },
                                    { num: '03', title: 'Post-Cognitive Review', text: 'Receive instantaneous, granular feedback on both technical logic and behavioral cues.' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row items-center lg:items-start group gap-6 sm:gap-8">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-bold border border-slate-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 text-sm">
                                            {step.num}
                                        </div>
                                        <div className="flex flex-col items-center lg:items-start">
                                            <h4 className="text-lg font-bold text-slate-950 tracking-tight uppercase tracking-wider group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                                            <p className="mt-2 text-slate-500 leading-relaxed font-medium text-[12px] opacity-80 lg:max-w-sm">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-[55%] w-full relative">
                            <div className="absolute -inset-8 bg-indigo-500/5 rounded-full blur-[80px] -z-10"></div>
                            <div className="relative p-4 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" 
                                    alt="Collaborative AI Results" 
                                    className="w-full rounded-[2.8rem] shadow-sm brightness-[0.98]" 
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white cursor-pointer hover:scale-110 transition-transform">
                                        <PlayCircle className="text-indigo-600 w-8 h-8 ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FINALE (CTA Footer Compact) */}
            <section id="about-us" className="w-full py-24 relative overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-indigo-900/40 opacity-50 blur-[120px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-8 text-center relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-10 backdrop-blur-3xl">
                        <Users className="w-3.5 h-3.5" /> Secure Your Foundation
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-10 text-white tracking-tight leading-[1.05]">Preparation is the <br /><span className="text-indigo-400">greatest variable.</span></h2>
                    <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-12 font-medium max-w-xl opacity-80">
                        Interview AI was built to democratize elite-level feedback for every ambitious candidate globally.
                    </p>
                    <Link to="/register" className="inline-flex items-center justify-center bg-indigo-600 text-white px-14 py-6 rounded-[2rem] font-bold text-[11px] tracking-widest uppercase hover:bg-indigo-500 transition-all duration-300 hover:-translate-y-2 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.4)]">
                        Get Started Free
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Landing;
