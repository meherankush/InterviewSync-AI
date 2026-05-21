import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewChat, endSession as endSessionAPI } from '../services/api';
import { Send, Clock, User, Mic, MicOff, AlertCircle, ShieldAlert, Monitor, Video, Code2, Play, Terminal, Zap, ShieldCheck, Bot, VideoOff } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { sendAlert } from '../services/api';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as cocossd from '@tensorflow-models/coco-ssd';

const InterviewChat = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCodingMode, setIsCodingMode] = useState(false);
    const [code, setCode] = useState('');
    const [codingTopic, setCodingTopic] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAutoListen, setIsAutoListen] = useState(true); 
    const [interimSpeech, setInterimSpeech] = useState('');
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);
    const sessionRef = useRef(null);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onend = () => {
                if (isAutoListen) {
                    setTimeout(() => startListening(), 500); 
                }
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    const startListening = () => {
        if (isListening) return;
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error", event);
            setIsListening(false);
        };

        recognitionRef.current.onresult = (event) => {
            let currentFinalTranscript = '';
            let currentInterimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    currentFinalTranscript += transcript;
                } else {
                    currentInterimTranscript += transcript;
                }
            }

            if (currentFinalTranscript) {
                setInterimSpeech('');
                setInputText(prev => {
                    const base = prev.trim();
                    return base ? `${base} ${currentFinalTranscript.trim()}` : currentFinalTranscript.trim();
                });
            } else {
                setInterimSpeech(currentInterimTranscript);
            }
        };

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setInterimSpeech('');
        }
    };

    const triggerAlert = (msg) => {
        setAlertMsg(msg);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 4000);
        const currentSessionId = sessionRef.current?._id || session?._id;
        if (currentSessionId) {
            sendAlert({ interviewId: currentSessionId, message: msg });
        }
    };

    useEffect(() => {
        const interviewData = localStorage.getItem('currentInterview');
        if (!interviewData) return navigate('/dashboard');

        const parsed = JSON.parse(interviewData);
        setSession(parsed.session);
        sessionRef.current = parsed.session;
        setTimeLeft(parsed.session.duration * 60);
        setMessages([{ role: 'assistant', content: parsed.firstQuestion }]);
        speakText(parsed.firstQuestion);

        let faceModel = null;
        let objectModel = null;
        let detectionInterval = null;

        const initProctoring = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => videoRef.current.play();
                }
                setCameraReady(true);
                setCameraError('');

                await tf.setBackend('webgl');
                faceModel = await blazeface.load();
                objectModel = await cocossd.load();

                detectionInterval = setInterval(async () => {
                    if (videoRef.current && videoRef.current.readyState === 4) {
                        try {
                            const faces = await faceModel.estimateFaces(videoRef.current, false);

                            if (faces.length === 0) {
                                triggerAlert('Security Alert: No face detected! Please stay in frame.');
                            } else if (faces.length > 1) {
                                triggerAlert('Security Alert: Multiple people detected in frame!');
                            } else if (faces.length === 1) {
                                const face = faces[0];
                                const rightEye = face.landmarks[0];
                                const leftEye = face.landmarks[1];
                                const nose = face.landmarks[2];

                                const eyeCenter = (rightEye[0] + leftEye[0]) / 2;
                                const lookOffset = Math.abs(nose[0] - eyeCenter);

                                if (lookOffset > 25) {
                                    triggerAlert('Security Alert: Please look directly at the screen!');
                                }
                            }

                            const objects = await objectModel.detect(videoRef.current);
                            const forbidden = ['cell phone', 'mobile phone', 'phone', 'laptop', 'tablet', 'book', 'remote'];

                            const detectedForbidden = objects.find(obj =>
                                forbidden.includes(obj.class.toLowerCase()) && obj.score > 0.45
                            );

                            if (detectedForbidden) {
                                triggerAlert(`Security Alert: Restricted device detected (${detectedForbidden.class})!`);
                            }

                        } catch (e) { console.error("Detection interval error", e); }
                    }
                }, 3000);
            } catch (err) {
                console.error("Proctoring Init Error", err);
                setCameraReady(false);
                setCameraError('Camera access is required to continue this interview.');
            }
        };

        if (parsed.session) initProctoring();

        const handleVisibility = () => { if (document.hidden) triggerAlert('Warning: Tab switch detected!'); };
        const handleMouseLeave = (e) => { if (e.clientY <= 0) triggerAlert('Warning: Mouse left the window boundaries!'); };

        document.addEventListener('visibilitychange', handleVisibility);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (detectionInterval) clearInterval(detectionInterval);
            document.removeEventListener('visibilitychange', handleVisibility);
            document.removeEventListener('mouseleave', handleMouseLeave);
            const stream = videoRef.current?.srcObject;
            if (stream) stream.getTracks().forEach(t => t.stop());
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, [navigate]);

    useEffect(() => {
        if (!session) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleEndSession();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [session]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !code.trim()) || loading) return;

        const userMsg = inputText.trim();
        const currentCode = code;

        const fullUserMessage = isCodingMode
            ? `${userMsg}\n\n[SOLVED CODE]:\n\`\`\`${language}\n${currentCode}\n\`\`\``
            : userMsg;

        setInputText('');
        setMessages((prev) => [...prev, {
            role: 'user',
            content: userMsg,
            hasCode: isCodingMode,
            codeSnippet: currentCode
        }]);
        setLoading(true);

        try {
            const res = await interviewChat({
                sessionId: session._id,
                userMessage: fullUserMessage
            });

            const data = res.data;
            const aiReply = data.reply + " " + (data.next_question || "");

            if (data.is_coding) {
                setIsCodingMode(true);
                setCodingTopic(data.coding_topic || "Technical Task");
                setCode(data.initial_code || "");
                if (session.domain.toLowerCase().includes('sql')) setLanguage('sql');
                else if (session.domain.toLowerCase().includes('java')) setLanguage('java');
                else if (session.domain.toLowerCase().includes('python')) setLanguage('python');
                else setLanguage('javascript');
            } else {
                setIsCodingMode(false);
            }

            setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
            speakText(aiReply);

        } catch (err) {
            console.error("Chat Error:", err);
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        try {
            await endSessionAPI({ interviewId: session._id });
            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
            }
            navigate(`/results/${session._id}`);
        } catch (err) {
            console.error("End Session Error", err);
            navigate('/dashboard');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (!session) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">Initializing session</p>
            </div>
        );
    }

    if (cameraError) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6">
                        <VideoOff className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-3">Camera Required</h1>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                        This coding interview requires a live camera feed for the participant and interviewer room experience.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full rounded-2xl bg-indigo-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700"
                    >
                        Allow Camera And Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!cameraReady) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
                <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mb-5"></div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Starting camera interview room</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50/30 overflow-hidden">
            {/* Sidebar Monitoring */}
            <div className="w-80 bg-white border-r border-slate-100 p-8 hidden lg:flex flex-col gap-10 animate-in fade-in slide-in-from-left duration-700">
                <div className="space-y-6">
                    {/* Interviewer Feed Card */}
                    <div className="relative group">
                        <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/20 border border-slate-200/50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.35),transparent_55%)]"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-900/30 mb-4">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <p className="text-white text-sm font-black tracking-tight">AI Interviewer</p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-200 mt-1">Live in room</p>
                            </div>
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Interviewer</span>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Camera Feed Card */}
                    <div className="relative group">
                        <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100/20 border border-slate-200/50">
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-110" />
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                                <span className="text-[9px] font-bold text-white uppercase tracking-widest">Participant</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Status Card */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Privacy Seal</h4>
                                <p className="text-sm font-bold text-slate-900">Active Monitoring</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Facial presence', status: 'Optimal', color: 'emerald' },
                                { label: 'Device restricted', status: 'Secure', color: 'emerald' },
                                { label: 'Atmosphere', status: 'Quiet', color: 'emerald' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-tight">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]`}></div>
                                        <span className={`text-[10px] font-bold text-${item.color}-600 uppercase`}>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-300" />
                    <p className="text-[10px] leading-relaxed text-slate-400 font-bold text-center tracking-tight px-2 uppercase">
                        AI-driven behavioral analysis in progress
                    </p>
                </div>
            </div>

            {/* Main Center Area */}
            <div className="flex-grow flex flex-col bg-white overflow-hidden relative">
                {/* Security Alerts */}
                {showAlert && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in slide-in-from-top-12 duration-500 w-max max-w-[90%]">
                        <div className="bg-white/95 backdrop-blur-xl px-6 py-3.5 rounded-2xl shadow-2xl border border-rose-100 flex items-center gap-4">
                            <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
                                <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h5 className="text-rose-600 font-bold text-[9px] uppercase tracking-widest">Protocol Warning</h5>
                                <p className="text-slate-900 font-bold text-sm tracking-tight">{alertMsg}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Interaction Bar */}
                <div className="px-8 py-5 border-b border-slate-100 bg-white/60 backdrop-blur-xl sticky top-0 z-10 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform hover:scale-105">
                            <User className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 text-lg tracking-tight">AI Interviewer</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.domain}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
                            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-rose-500' : 'text-slate-400'}`} />
                            <span className={`font-mono font-bold text-xl tracking-tighter ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <button
                            onClick={handleEndSession}
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-black transition-all active:scale-95 uppercase tracking-widest shadow-xl shadow-slate-200"
                        >
                            Finalize
                        </button>
                    </div>
                </div>

                {/* Chat Scrollbox */}
                <div className="flex-grow overflow-y-auto px-8 py-12 space-y-10 bg-slate-50/20">
                    <div className="mx-auto max-w-3xl space-y-10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}>
                                <div className={`flex items-start gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-xl shrink-0 mt-1 flex items-center justify-center border ${msg.role === 'user'
                                        ? 'bg-white border-indigo-100 text-indigo-600 shadow-sm'
                                        : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-100'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                    </div>
                                    <div className={`px-7 py-5 rounded-3xl relative transition-all shadow-sm ${msg.role === 'user'
                                        ? 'bg-white text-slate-800 border border-indigo-50 rounded-tr-none'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                        }`}>
                                        <p className="leading-relaxed text-base font-medium whitespace-pre-wrap">{msg.content}</p>

                                        {msg.hasCode && (
                                            <div className="mt-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner">
                                                <div className="flex justify-between items-center mb-2 px-1">
                                                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">{language} snippet</span>
                                                </div>
                                                <pre className="text-indigo-200/90">{msg.codeSnippet}</pre>
                                            </div>
                                        )}
                                        
                                        <div className={`absolute -bottom-6 flex items-center gap-2 ${msg.role === 'user' ? 'right-1' : 'left-1'}`}>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                                        <Monitor className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white px-8 py-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-4">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:800ms]"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s] [animation-duration:800ms]"></div>
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.4s] [animation-duration:800ms]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={chatEndRef} />
                </div>

                {/* User Input Module */}
                <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                    <div className="mx-auto max-w-4xl relative">
                        <div className="relative flex items-end gap-4 bg-slate-50/50 rounded-3xl p-2.5 border border-slate-100 focus-within:border-indigo-200 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-indigo-50/50 transition-all duration-300">
                            <textarea
                                rows="1"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={isListening ? (interimSpeech || "Awaiting your voice...") : "Frame your answer here..."}
                                className="flex-grow bg-transparent border-none px-5 py-3.5 focus:ring-0 outline-none transition-all resize-none font-medium text-slate-700 min-h-[52px] text-base placeholder:text-slate-300"
                            />
                            <div className="flex gap-2 items-center pr-3 pb-2">
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? "Stop Microphone" : "Speak Answer"}
                                    className={`p-3 rounded-2xl transition-all duration-300 active:scale-90 border shadow-sm ${isListening
                                        ? 'bg-rose-50 text-rose-600 animate-pulse border-rose-100'
                                        : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600 hover:border-indigo-100'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={loading || (!inputText.trim() && !code.trim())}
                                    className={`pl-5 pr-7 py-3 rounded-2xl shadow-xl transition-all duration-300 active:scale-95 flex items-center gap-3 ${loading || (!inputText.trim() && !code.trim())
                                        ? 'bg-slate-100 text-slate-300 shadow-none'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200'
                                        }`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">{isCodingMode ? 'Submit' : 'Send'}</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* IDE Slide-out Section */}
            {isCodingMode && (
                <div className="w-full lg:w-[48%] h-full bg-[#1e1e1e] border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-700 z-30 shadow-2xl">
                    <div className="p-6 border-b border-slate-800 bg-[#1e1e1e] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/30 flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest leading-none mb-1.5">Environment</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{codingTopic}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 group cursor-pointer hover:bg-emerald-500/20 transition-all duration-300">
                                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Execute</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val)}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 25 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontWeight: "500",
                                lineNumbers: 'on',
                                renderLineHighlight: 'none',
                                smoothScrolling: true,
                                cursorSmoothCaretAnimation: "on"
                            }}
                        />
                    </div>
                    <div className="p-6 bg-[#1e1e1e] border-t border-slate-800 flex items-center gap-4">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                            <Terminal className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Runtime Console</span>
                        <div className="flex-grow h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="w-1/3 h-full bg-emerald-500/30 transition-all duration-1000"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewChat;
