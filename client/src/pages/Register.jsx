import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import { ArrowRight, Mail, Lock, User, Sparkles } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await registerApi({ name, email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-0 overflow-hidden bg-white">
            {/* Left Side: Premium Light Visual */}
            <div className="hidden lg:flex lg:w-1/2 h-screen relative bg-white overflow-hidden group border-r border-slate-100">
                <div className="absolute inset-0 z-0">
                    {/* Soft Light Gradient & Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.1),transparent_70%)]"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Atmospheric Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-50 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-purple-50 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
                </div>

                <div className="relative z-10 w-full p-20 flex flex-col justify-center">
                    <div className="animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-10 border border-indigo-100 shadow-sm">
                            <Sparkles className="w-3 h-3" /> Start for free
                        </div>
                        <h1 className="text-6xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tighter">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Future of Work.</span>
                        </h1>
                        <div className="space-y-8">
                            {[
                                "AI-Powered Real-time Interviewing",
                                "Deep Performance Analytics & Feedback",
                                "Industry Specific Technical Challenges",
                                "Smart Proctoring & Integrity Reports"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-500 font-bold text-lg">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">✓</div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Simple Registration Form */}
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-8 pt-24 bg-gray-50/50 relative">
                <div className="max-w-md w-full animate-slide-up py-12">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join 10,000+ students already practicing.</p>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-shake">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 uppercase tracking-widest text-xs group mt-4"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-slate-500 text-sm font-bold">
                                Already have an account? <Link to="/login" className="text-indigo-600 hover:underline ml-1">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
