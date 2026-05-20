import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import InterviewScreen from './pages/InterviewScreen';
import InterviewChat from './pages/InterviewChat';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import InterviewsHistory from './pages/dashboard/InterviewsHistory';
import Analytics from './pages/dashboard/Analytics';
import SecurityAlerts from './pages/dashboard/SecurityAlerts';
import StartInterview from './pages/dashboard/StartInterview';
import CodeRoom from './pages/dashboard/CodeRoom';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const isResults = location.pathname.startsWith('/results');
    const hideNav = ['/chat', '/interview'].includes(location.pathname);
    const hideFooter = ['/chat', '/interview', '/login', '/register'].includes(location.pathname) || isDashboard || isResults;

    return (
        <div className="min-h-screen flex flex-col">
            {!hideNav && <Navbar />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/code-room" element={<CodeRoom publicAccess />} />

                    {/* Nested Dashboard Routes */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardOverview />} />
                        <Route path="history" element={<InterviewsHistory />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="reports" element={<InterviewsHistory />} />
                        <Route path="alerts" element={<SecurityAlerts />} />
                        <Route path="start" element={<StartInterview />} />
                        <Route path="code-room" element={<CodeRoom />} />
                    </Route>

                    <Route path="/interview" element={<InterviewScreen />} />
                    <Route path="/chat" element={<InterviewChat />} />
                    <Route path="/results/:id" element={<Results />} />
                </Routes>
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
}

export default App;
