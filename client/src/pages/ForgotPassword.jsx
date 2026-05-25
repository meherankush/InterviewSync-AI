import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { API_BASE_URL, forgotPassword } from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await forgotPassword({ email });
            setMessage(res.data.message || 'Reset request received.');
        } catch (err) {
            const nextError = err.response?.data?.message || err.message || 'Unable to process reset request';
            setError(err.response ? nextError : `${nextError}. API: ${API_BASE_URL}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pt-24">
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-7">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Recover Access</h1>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                    Enter your registered email. If reset email service is configured, instructions will be sent to you.
                </p>

                {message && (
                    <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="space-y-2 block">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Email</span>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 font-bold text-slate-800 outline-none focus:border-indigo-400 focus:bg-white"
                                placeholder="you@example.com"
                            />
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Request Reset'}
                    </button>
                </form>

                <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
