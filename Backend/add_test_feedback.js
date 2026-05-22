import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import MockInterviewFeedback from './models/mockInterviewFeedback.model.js';

await connectDB();

const testUserId = '68bc51faf6b48a6abac98fbe';

const sampleFeedback = {
    userId: testUserId,
    domain: 'Frontend',
    questions: [
        'Tell me about your experience with React',
        'How do you handle state management?'
    ],
    transcripts: [
        'I have extensive experience working with React, using hooks like useState and useEffect. I have built multiple projects including a dashboard application.',
        'For state management, I prefer using Redux for complex applications, but for simpler cases I use the Context API with useReducer.'
    ],
    feedback: {
        semantic_analysis: {
            relevance: [8, 9],
            clarity: [7, 8],
            confidence: [6, 7]
        },
        body_language: {
            eye_contact: 7,
            posture: 8,
            face_presence: 6,
            emotions: { happy: 0.3, neutral: 0.6, focused: 0.1 }
        },
        tone_confidence: {
            tone: { calm: 0.7, enthusiastic: 0.3 },
            confidence: { high: 0.6, medium: 0.4 },
            speech_rate: { normal: 0.8, fast: 0.2 }
        },
        full_transcript: 'Combined transcript text...',
        ai_feedback: 'Good technical knowledge with clear explanations.',
        strengths: ['Strong React knowledge', 'Good state management understanding'],
        improvements: ['Could provide more specific examples', 'Practice speaking more confidently'],
        suggestions: 'Consider learning advanced React patterns like render props and HOCs.'
    },
    score: 75
};

try {
    // Check if feedback already exists
    const existing = await MockInterviewFeedback.findOne({ userId: testUserId });
    if (existing) {
        console.log('Feedback already exists for this user:', existing.userId);
        console.log('Domain:', existing.domain);
        console.log('Score:', existing.score);
        console.log('Created at:', existing.createdAt);
    } else {
        const newFeedback = new MockInterviewFeedback(sampleFeedback);
        await newFeedback.save();
        console.log('✅ Sample feedback added for user:', testUserId);
    }
} catch (error) {
    console.error('Error:', error);
} finally {
    process.exit(0);
}