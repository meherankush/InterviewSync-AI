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
        handleScroll(); // Check initially
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const isLanding = location.pathname === '/';
    const showDarkNav = isScrolled || !isLanding;

    const NavLinks = () => (
        <>
            {isLanding && (
                <>
                    <a href="#features" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-full text-sm font-black transition-all tracking-tight">Features</a>
                    <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-full text-sm font-black transition-all tracking-tight">How It Works</a>
                    <a href="#about-us" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-full text-sm font-black transition-all tracking-tight">About Us</a>
                </>
            )}
        </>
    );

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ease-out ${isScrolled || !isLanding ? 'bg-white/70 backdrop-blur-2xl border-b border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-[1rem] bg-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                <span className="text-white font-black text-2xl">I</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900">
                                Interview<span className="text-indigo-600 font-black">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLinks />
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {token ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Dashboard</Link>
                                <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-rose-600 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-full text-sm font-black transition-all tracking-tight">Login</Link>
                                <Link to="/register" className="group flex items-center bg-slate-900 text-white px-7 py-3 rounded-2xl text-[10px] font-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:bg-black hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 uppercase tracking-widest">
                                    Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-900 hover:text-indigo-600 p-2 transition-colors">
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-2xl py-8 px-6 flex flex-col space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <NavLinks />
                    <div className="h-px bg-slate-100 my-4 w-full"></div>
                    {token ? (
                        <>
                            <Link to="/dashboard" className="text-slate-900 font-black px-4 py-3 rounded-2xl hover:bg-indigo-50 transition-colors uppercase tracking-widest text-[10px]">Dashboard</Link>
                            <button onClick={handleLogout} className="text-rose-600 font-black px-4 py-3 flex items-center gap-3 hover:bg-rose-50 rounded-2xl transition-colors uppercase tracking-widest text-[10px]"><LogOut className="w-4 h-4" /> Logout</button>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <Link to="/login" className="text-center font-black py-4 border border-slate-200 rounded-2xl text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">Login</Link>
                            <Link to="/register" className="text-center bg-indigo-600 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200">Get Started Free</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
