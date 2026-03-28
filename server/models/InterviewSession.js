import mongoose from 'mongoose';

const alertSchema = mongoose.Schema({
    time: { type: Date, default: Date.now },
    message: { type: String, required: true }
});

const sessionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalScore: { type: Number, default: 0 },
    alertCount: { type: Number, default: 0 },
    alerts: [alertSchema],
    currentQuestionIndex: { type: Number, default: 0 },
    personalityDevelopment: {
        behaviorScore: { type: Number, default: 0 }, // 0-10
        confidenceScore: { type: Number, default: 0 }, // 0-10
        emotionSummary: { type: String, default: "" }, // e.g., "Calm", "Confused", "Stressed"
        behaviorFeedback: { type: String, default: "" }
    },
    conversation: [
        {
            role: { type: String, enum: ["assistant", "user"] },
            content: { type: String }
        }
    ]
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', sessionSchema);
export default InterviewSession;
