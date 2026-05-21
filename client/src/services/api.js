import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

export const getDashboardInfo = () => API.get('/interview/dashboard');
export const getInterviewDetails = (id) => API.get(`/interview/${id}`);
export const startSession = (data) => API.post('/interview/start', data);
export const evaluateQuestion = (data) => API.post('/interview/evaluate', data);
export const interviewChat = (data) => API.post('/interview/chat', data);
export const endSession = (data) => API.post('/interview/end', data);
export const sendAlert = (data) => API.post('/interview/alert', data);
