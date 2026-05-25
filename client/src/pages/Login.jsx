import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL, login as loginApi } from '../services/api';
import { ArrowRight, Mail, Lock, Zap } from 'lucide-react';

const Login = () => {
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
            const res = await loginApi({ email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Login failed';
            setError(err.response ? message : `${message}. API: ${API_BASE_URL}`);
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
                        <div className="w-16 h-1.5 bg-indigo-600 mb-10 rounded-full"></div>
                        <h1 className="text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                            Next-gen AI <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Interview Coach
                            </span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                            The simplest way to practice interviews. Get real-time AI feedback and crack your dream job.
                        </p>
                    </div>

                    <div className="mt-16 flex items-center gap-10">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Joined by 10k+ Students</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Simple Login Form */}
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-8 pt-24 bg-gray-50/50 relative">
                <div className="max-w-md w-full animate-slide-up py-12">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-4 border border-indigo-100 shadow-sm">
                            <Zap className="w-3 h-3" /> Welcome Back
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Sign In</h2>
                        <p className="text-slate-500 font-medium">Continue your journey to success.</p>
                    </div>

                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3 animate-shake">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-bold text-slate-800"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                                    <Link to="/forgot-password" className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 tracking-widest uppercase">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 font-bold text-slate-800"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 uppercase tracking-widest text-xs group"
                            >
                                {loading ? 'Checking...' : 'Enter Dashboard'}
                                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                            <p className="text-slate-500 text-sm font-bold">
                                New here? <Link to="/register" className="text-indigo-600 hover:underline ml-1">Create an account</Link>
                            </p>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        &copy; 2026 InterviewAI • Secured by Advanced AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
