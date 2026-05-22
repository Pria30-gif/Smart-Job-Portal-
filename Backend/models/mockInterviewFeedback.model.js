import mongoose from 'mongoose';

const mockInterviewFeedbackSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    domain: { type: String, required: true },
    questions: [{ type: String }],
    transcripts: [{ type: String }],
    feedback: {
        semantic_analysis: {
            relevance: { type: [Number] },
            clarity: { type: [Number] },
            confidence: { type: [Number] }
        },
        body_language: {
            eye_contact: Number,
            posture: Number,
            face_presence: Number,
            emotions: mongoose.Schema.Types.Mixed
        },
        tone_confidence: {
            tone: mongoose.Schema.Types.Mixed,
            confidence: mongoose.Schema.Types.Mixed,
            speech_rate: mongoose.Schema.Types.Mixed
        },
        full_transcript: String,
        ai_feedback: String,
        strengths: [String],
        improvements: [String],
        suggestions: String
    },
    score: Number,
    analysisDate: { type: Date, default: Date.now }
}, { timestamps: true });

const MockInterviewFeedback = mongoose.model('MockInterviewFeedback', mockInterviewFeedbackSchema);

export default MockInterviewFeedback;
