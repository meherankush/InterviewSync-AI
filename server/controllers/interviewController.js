import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import InterviewSession from '../models/InterviewSession.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const startSession = async (req, res) => {
    try {
        const { domain, duration } = req.body;

        let questionCount = duration === 10 ? 5 : 8;
        const questions = await Question.aggregate([
            { $match: { domain } },
            { $sample: { size: questionCount } }
        ]);

        const fallbackQuestions = {
            DSA: 'Solve this problem: Given an array of integers, explain how you would find two numbers that add up to a target value. Discuss the optimal time complexity.',
            'Web Development': 'Explain how React state updates work and how you would optimize a slow component in a production web app.',
            'Machine Learning': 'Explain overfitting and describe practical techniques you would use to reduce it in a machine learning model.',
            'Data Science': 'Given a dataset with missing values and outliers, explain your process for cleaning it before analysis.',
            HR: 'Tell me about yourself and describe one project where you showed ownership and problem-solving.',
            DBMS: 'Explain indexing in databases and how you would decide which columns should be indexed for a slow query.',
        };

        const firstQuestion = questions[0]?.question || fallbackQuestions[domain] || `Tell me about your experience with ${domain}.`;

        const newSession = await InterviewSession.create({
            userId: req.user.id,
            domain,
            duration,
            conversation: [
                { role: "assistant", content: firstQuestion }
            ]
        });

        res.status(201).json({ session: newSession, firstQuestion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const evaluateAnswer = async (req, res) => {
    try {
        const { interviewId, questionId, question, userAnswer } = req.body;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are an expert technical interviewer evaluating a candidate's answer.
Evaluate the following answer to the interview question based on:
1. Technical correctness (0-10)
2. Clarity (0-10)
3. Depth (0-10)

Question: ${question}
User Answer: ${userAnswer}

If the user's answer is blank, totally irrelevant, or explicitly states they do not know, give 0s for the scores. Give actionable and professional feedback explaining why they got the score they did, and what they could improve.

Return EXACTLY a JSON string with the following structure (no markdown markup like \`\`\`json, no backticks, just raw JSON text):
{
  "technicalScore": <number>,
  "clarityScore": <number>,
  "depthScore": <number>,
  "feedback": "<string>"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawContent = response.text().trim();

        // Clean up markdown in case Gemini adds it despite instructions
        const jsonContent = rawContent.replace(/^```json/, '').replace(/```$/, '').trim();
        const evaluation = JSON.parse(jsonContent);

        const answer = await Answer.create({
            interviewId,
            questionId,
            answerText: userAnswer || "No answer provided",
            ...evaluation
        });

        res.status(201).json({ evaluation, answer });
    } catch (error) {
        console.error("Gemini Evaluation Error:", error);
        res.status(500).json({ error: error.message });
    }
}

export const endSession = async (req, res) => {
    try {
        const { interviewId } = req.body;
        const answers = await Answer.find({ interviewId });
        const session = await InterviewSession.findById(interviewId);

        let totalScore = session ? session.totalScore : 0;

        if (answers.length > 0) {
            const sum = answers.reduce((acc, ans) => acc + (ans.technicalScore + ans.clarityScore + ans.depthScore) / 3, 0);
            totalScore = sum / answers.length; // Average score out of 10
        }

        const updatedSession = await InterviewSession.findByIdAndUpdate(
            interviewId,
            { totalScore: parseFloat(totalScore.toFixed(1)) },
            { new: true }
        );
        res.status(200).json({ success: true, session: updatedSession });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const submitAlert = async (req, res) => {
    try {
        const { interviewId, message } = req.body;
        console.log(`Alert Received for Session ${interviewId}: ${message}`);
        await InterviewSession.findByIdAndUpdate(interviewId, {
            $inc: { alertCount: 1 },
            $push: { alerts: { time: new Date(), message } }
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Alert Submission Error:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user.id }).sort({ createdAt: -1 });

        const totalInterviews = sessions.length;
        const bestScore = totalInterviews > 0 ? Math.max(...sessions.map(s => s.totalScore)) : 0;
        const avgScore = totalInterviews > 0 ? sessions.reduce((acc, s) => acc + s.totalScore, 0) / totalInterviews : 0;
        const totalAlerts = sessions.reduce((acc, s) => acc + s.alertCount, 0);
        
        // Personality stats
        const sessionsWithPersonality = sessions.filter(s => s.personalityDevelopment);
        const avgBehavior = sessionsWithPersonality.length > 0 
            ? sessionsWithPersonality.reduce((acc, s) => acc + (s.personalityDevelopment.behaviorScore || 0), 0) / sessionsWithPersonality.length 
            : 0;
        const avgConfidence = sessionsWithPersonality.length > 0 
            ? sessionsWithPersonality.reduce((acc, s) => acc + (s.personalityDevelopment.confidenceScore || 0), 0) / sessionsWithPersonality.length 
            : 0;

        // Prepare chart data
        const performanceData = sessions.slice(0, 10).reverse().map((s, i) => ({
            name: `Int ${sessions.length - i}`,
            score: s.totalScore
        }));

        const domainStats = {};
        sessions.forEach(s => {
            if (!domainStats[s.domain]) domainStats[s.domain] = { total: 0, count: 0 };
            domainStats[s.domain].total += s.totalScore;
            domainStats[s.domain].count += 1;
        });

        const domainData = Object.keys(domainStats).map(d => ({
            domain: d,
            avgScore: parseFloat((domainStats[d].total / domainStats[d].count).toFixed(1))
        }));

        res.json({
            stats: {
                totalInterviews,
                avgScore: parseFloat(avgScore.toFixed(1)),
                bestScore: parseFloat(bestScore.toFixed(1)),
                totalAlerts,
                avgBehavior: parseFloat(avgBehavior.toFixed(1)),
                avgConfidence: parseFloat(avgConfidence.toFixed(1))
            },
            recentInterviews: sessions.slice(0, 5).map(s => ({
                id: s._id,
                domain: s.domain,
                createdAt: s.createdAt,
                totalScore: s.totalScore,
                alertCount: s.alertCount,
                alerts: s.alerts,
                personality: s.personalityDevelopment
            })),
            performanceData,
            domainData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const chatInterview = async (req, res) => {
    try {
        const { sessionId, userMessage } = req.body;

        const session = await InterviewSession.findById(sessionId);
        if (!session) return res.status(404).json({ error: "Session not found" });

        // Push user message to DB
        session.conversation.push({ role: "user", content: userMessage });

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const totalQuestions = session.duration === 10 ? 5 : 8;
        const currentQ = session.currentQuestionIndex || 0;
        const isNearEnd = (totalQuestions - currentQ) <= 2;

        const systemPrompt = `You are a professional technical interviewer for the domain: ${session.domain}.
Rules:
- Ask domain-related questions only.
- Current progress: Question ${currentQ + 1} of ${totalQuestions}.
${isNearEnd ? `- We are near the end. You MUST ask a practical coding task or a database query task now based on the domain.` : `- Ask conceptual or technical questions based on the domain.`}
- Ask 1 follow-up question per main answer if needed.
- Evaluate user's answer for technical correctness, clarity, and depth.
- Also evaluate user's "Behavior & Emotion" based on their response. Detect if they are: confident, confused, frustrated, calm, or descriptive.
- In "behavior_feedback", provide short advice on how they can improve their presentation/persona.
- Maintain professional tone.

Return JSON ONLY (no markdown markup, no backticks, just raw JSON):
{
  "reply": "your response to user message",
  "technical_score": number,
  "clarity_score": number,
  "depth_score": number,
  "behavior_score": number (0-10, evaluation of their behavioral confidence/professionalism),
  "confidence_score": number (0-10, evaluation of their internal certainty),
  "emotion": "string (e.g. 'Calm', 'Confused', 'Confident', 'Hesitant')",
  "behavior_feedback": "string (short advice on personality improvement)",
  "next_question": "next main question if applicable",
  "is_coding": boolean,
  "coding_topic": "string",
  "initial_code": "string"
}`;

        // Prepare History for Gemini Chat - MUST start with 'user' role
        let history = [];

        const firstUserMsg = {
            role: "user",
            parts: [{ text: `Hi, I am ready to start the interview for ${session.domain}. Total questions planned: ${totalQuestions}. Please follow these instructions: ${systemPrompt}` }]
        };

        const existingMessages = session.conversation.map(msg => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        history = [firstUserMsg, ...existingMessages];

        // Gemini's sendMessage expects the latest message NOT to be in history
        const latestMessage = history.pop();

        // Start chat with history
        const chat = model.startChat({
            history: history,
        });

        // Send user's latest message
        const result = await chat.sendMessage(latestMessage.parts[0].text);
        const response = await result.response;
        const rawContent = response.text().trim();

        // Clean up markdown
        const jsonContent = rawContent.replace(/^```json/, '').replace(/```$/, '').trim();
        const aiResponse = JSON.parse(jsonContent);

        // Update scores (running average)
        const tScore = aiResponse.technical_score ?? aiResponse.technicalScore;
        const cScore = aiResponse.clarity_score ?? aiResponse.clarityScore;
        const dScore = aiResponse.depth_score ?? aiResponse.depthScore;
        const bScore = aiResponse.behavior_score ?? 0;
        const confScore = aiResponse.confidence_score ?? 0;

        if (tScore !== undefined && cScore !== undefined && dScore !== undefined) {
            const currentCount = session.currentQuestionIndex || 0;
            const newMsgAvg = (Number(tScore) + Number(cScore) + Number(dScore)) / 3;

            // Calculate new total average
            session.totalScore = ((session.totalScore * currentCount) + newMsgAvg) / (currentCount + 1);
            
            // Update personality averages
            if (!session.personalityDevelopment) {
                session.personalityDevelopment = { behaviorScore: 0, confidenceScore: 0, emotionSummary: "", behaviorFeedback: "" };
            }

            session.personalityDevelopment.behaviorScore = ((session.personalityDevelopment.behaviorScore * currentCount) + Number(bScore)) / (currentCount + 1);
            session.personalityDevelopment.confidenceScore = ((session.personalityDevelopment.confidenceScore * currentCount) + Number(confScore)) / (currentCount + 1);
            session.personalityDevelopment.emotionSummary = aiResponse.emotion || "In Progress";
            session.personalityDevelopment.behaviorFeedback = aiResponse.behavior_feedback || "";

            session.currentQuestionIndex = currentCount + 1;
        }

        // Push assistant response to DB
        const fullReply = aiResponse.reply + (aiResponse.next_question ? " " + aiResponse.next_question : "");
        session.conversation.push({ role: "assistant", content: fullReply });

        await session.save();

        res.json({
            reply: aiResponse.reply,
            next_question: aiResponse.next_question,
            totalScore: session.totalScore,
            personality: session.personalityDevelopment,
            is_coding: aiResponse.is_coding || false,
            coding_topic: aiResponse.coding_topic || "",
            initial_code: aiResponse.initial_code || ""
        });

    } catch (error) {
        console.error("Gemini Chat Error:", error);
        res.status(500).json({ error: error.message });
    }
}

export const getInterviewDetails = async (req, res) => {
    try {
        const interview = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
        if (!interview) return res.status(404).json({ error: 'Interview not found' });

        const answers = await Answer.find({ interviewId: interview._id }).populate('questionId');

        const evaluations = answers.map(ans => ({
            question: ans.questionId ? ans.questionId.question : "Unknown Question",
            result: {
                technicalScore: ans.technicalScore,
                clarityScore: ans.clarityScore,
                depthScore: ans.depthScore,
                feedback: ans.feedback
            }
        }));

        res.json({ interview, evaluations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
