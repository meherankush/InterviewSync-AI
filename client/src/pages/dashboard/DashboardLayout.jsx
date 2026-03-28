import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { Menu, X, ChevronRight } from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Mapping path to title for mobile header
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Overview';
        if (path === '/dashboard/start') return 'Start Interview';
        if (path === '/dashboard/history') return 'History';
        if (path === '/dashboard/analytics') return 'Analytics';
        if (path === '/dashboard/reports') return 'Reports';
        if (path === '/dashboard/alerts') return 'Security Alerts';
        return 'Dashboard';
    };

    return (
        <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)] pt-16 relative">
            {/* Mobile Header Toggle (Bottom Right Floating) */}
            <div className="lg:hidden fixed bottom-6 right-6 z-[100]">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[80] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-[90] transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 lg:z-10
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow min-h-full overflow-hidden relative w-full lg:w-auto">
                {/* Subtle background decorative elements */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-50/20 rounded-full blur-[100px] -z-10"></div>

                {/* Mobile Header Bar */}
                <div className="lg:hidden px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dashboard</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-sm font-black text-indigo-600 tracking-tighter">{getPageTitle()}</span>
                    </div>
                </div>

                <div className="relative z-10 w-full overflow-y-auto max-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
