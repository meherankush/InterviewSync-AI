import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isLanding = location.pathname === '/';

    const NavLinks = () => (
        <>
            {isLanding && (
                <div className="flex items-center gap-1">
                    <a href="#features" className="text-slate-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">Features</a>
                    <a href="#how-it-works" className="text-slate-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">How It Works</a>
                    <a href="#about-us" className="text-slate-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">About</a>
                </div>
            )}
        </>
    );

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${isScrolled || !isLanding ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-xl">I</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Interview<span className="text-indigo-600">AI</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center">
                        <NavLinks />
                    </div>

                    <div className="hidden md:flex items-center space-x-3">
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-slate-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Dashboard</Link>
                                <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-rose-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-500 hover:text-indigo-600 px-5 py-2 rounded-xl text-sm font-bold transition-all">Login</Link>
                                <Link to="/register" className="group flex items-center bg-indigo-600 text-white px-7 py-3 rounded-2xl text-[10px] font-bold transition-all shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 uppercase tracking-widest">
                                    Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl py-8 px-8 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <NavLinks />
                    <div className="h-px bg-slate-50 my-2"></div>
                    {token ? (
                        <>
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-slate-900 font-bold py-3 text-xs uppercase tracking-widest">Dashboard</Link>
                            <button onClick={handleLogout} className="text-rose-600 font-bold py-3 text-xs uppercase tracking-widest text-left">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="font-bold py-3 text-xs uppercase tracking-widest text-slate-600">Login</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-indigo-600 text-white text-center font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Get Started Free</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
