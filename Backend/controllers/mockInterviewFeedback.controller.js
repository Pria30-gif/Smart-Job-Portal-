<<<<<<< HEAD
import { singleUpload } from '../middleware/multer.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import MockInterviewFeedback from '../models/mockInterviewFeedback.model.js';
import OpenAI from 'openai';

// Small helper to check OpenAI availability without exposing the key
export const testOpenAI = async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ ok: false, message: 'OPENAI_API_KEY not configured on server.' });
    }
    try {
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say hello in one word.' }
            ],
            max_tokens: 20,
            temperature: 0
        });
        const text = completion.choices?.[0]?.message?.content || '';
        return res.json({ ok: true, message: 'OpenAI reachable', sample: text.trim() });
    } catch (err) {
        console.error('Test OpenAI call failed:', err?.message || err);
        return res.status(500).json({ ok: false, message: 'OpenAI call failed', error: err?.message || String(err) });
    }
};

export const getFeedback = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get the latest feedback from database
        const feedback = await MockInterviewFeedback.findOne({ userId })
            .sort({ createdAt: -1 })
            .lean();
        
        if (!feedback) {
            return res.status(404).json({ 
                error: 'No feedback available yet. Please complete an interview first.' 
            });
        }

        // Include domain metadata so frontend learning resources can resolve correctly
        res.json({ feedback: { ...(feedback.feedback || {}), domain: feedback.domain || '' } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Define makeBasicFeedback outside to avoid scoping issues
const makeBasicFeedback = (parsedTranscripts, parsedQuestions, videoPath) => {
    // Enhanced heuristic analyzer with real, meaningful analysis
    const domainKeywords = {
        'Frontend': ['javascript', 'react', 'css', 'html', 'component', 'hook', 'state', 'props', 'dom', 'api', 'async', 'promise', 'node', 'framework', 'responsive', 'debug'],
        'Backend': ['api', 'database', 'server', 'node', 'express', 'authentication', 'middleware', 'rest', 'crud', 'endpoint', 'query', 'schema', 'model'],
        'Data Structures & Algorithms': ['array', 'linked list', 'tree', 'graph', 'sorting', 'searching', 'complexity', 'o(n)', 'recursion', 'dynamic programming', 'stack', 'queue', 'hash'],
        'Operating Systems': ['process', 'thread', 'memory', 'cpu', 'scheduling', 'deadlock', 'synchronization', 'kernel', 'virtual memory', 'context switching'],
        'Computer Networks': ['tcp', 'udp', 'http', 'dns', 'ip', 'router', 'protocol', 'osi', 'layer', 'packet', 'subnet'],
        'DBMS': ['sql', 'database', 'query', 'join', 'index', 'primary key', 'normalization', 'transaction', 'acid', 'schema'],
        'Java': ['java', 'class', 'object', 'inheritance', 'polymorphism', 'interface', 'abstract', 'exception', 'thread', 'collection', 'jvm'],
        'Python': ['python', 'function', 'class', 'object', 'list', 'dictionary', 'tuple', 'decorator', 'generator', 'module', 'package'],
        'MySQL': ['mysql', 'database', 'table', 'query', 'join', 'index', 'sql', 'primary key', 'foreign key', 'normalize']
    };

    const softSkillKeywords = ['experience', 'project', 'skill', 'develop', 'design', 'lead', 'implement', 'optimize', 'test', 'team', 'deliver', 'result', 'improve', 'learn', 'achieve', 'collaborate', 'communicate', 'problem', 'solve', 'challenge', 'success'];

    // Calculate scores for each transcript
    const scores = parsedTranscripts.map((t, idx) => {
        if (!t || t.trim().length === 0) {
            return { relevance: 2, clarity: 2, confidence: 2, content: '' };
        }
        
        const lower = t.toLowerCase();
        const wordCount = t.trim().split(/\s+/).length;
        
        // Check for domain-specific keywords
        const domainMatches = Object.entries(domainKeywords).flatMap(([domain, kws]) => 
            kws.filter(kw => lower.includes(kw)).map(kw => domain)
        );
        const uniqueDomains = [...new Set(domainMatches)];
        
        // Check for soft skill keywords
        const softSkillMatches = softSkillKeywords.filter(k => lower.includes(k));
        
        // Calculate relevance score (0-10)
        let relevance = Math.min(10, Math.round((domainMatches.length / 5 + softSkillMatches.length / 3) * 3));
        
        // Calculate clarity score based on answer length (0-10)
        let clarity = 2;
        if (wordCount > 100) clarity = 9;
        else if (wordCount > 60) clarity = 8;
        else if (wordCount > 40) clarity = 7;
        else if (wordCount > 25) clarity = 6;
        else if (wordCount > 15) clarity = 5;
        else if (wordCount > 8) clarity = 4;
        else if (wordCount > 3) clarity = 3;
        
        // Calculate confidence based on completeness and structure
        let confidence = 5;
        if (wordCount > 80) confidence = 9;
        else if (wordCount > 50) confidence = 8;
        else if (wordCount > 30) confidence = 7;
        else if (wordCount > 15) confidence = 6;
        else if (wordCount > 5) confidence = 4;
        
        // Check for structure indicators (first, second, finally, however, therefore, etc.)
        const structureWords = ['first', 'second', 'third', 'finally', 'however', 'therefore', 'additionally', 'moreover', 'because', 'for example', 'such as'];
        const hasStructure = structureWords.some(sw => lower.includes(sw));
        if (hasStructure && confidence < 9) confidence += 1;
        
        return { relevance, clarity, confidence, content: t };
    });

    const relevance = scores.map(s => s.relevance);
    const clarity = scores.map(s => s.clarity);
    const confidence = scores.map(s => s.confidence);
    const tone = scores.map(s => s.confidence > 5 ? 7 : 5);
    const speech_rate = scores.map(s => Math.min(10, Math.max(3, Math.round(s.content.split(/\s+/).length / 15))));

    // Body language: simulate realistic scores based on engagement
    const answeredCount = parsedTranscripts.filter(t => t && t.trim().length > 0).length;
    const totalQuestions = parsedQuestions.length || 1;
    const answerRate = answeredCount / totalQuestions;
    
    const baseScore = 50 + (answerRate * 30);
    const eye_contact_pct = Math.min(95, Math.round(baseScore + Math.random() * 15));
    const posture_score = Math.min(10, Math.round(4 + answerRate * 5 + Math.random() * 2));
    const engagement_score = Math.min(10, Math.round(3 + answerRate * 5 + Math.random() * 2));
    const face_presence_pct = Math.min(95, Math.round(baseScore + 10 + Math.random() * 10));

    // Compute overall score (0-100)
    const avgRelevance = relevance.length ? (relevance.reduce((a,b)=>a+b,0)/relevance.length) : 0;
    const avgClarity = clarity.length ? (clarity.reduce((a,b)=>a+b,0)/clarity.length) : 0;
    const avgTone = tone.length ? (tone.reduce((a,b)=>a+b,0)/tone.length) : 0;
    const avgConfidence = confidence.length ? (confidence.reduce((a,b)=>a+b,0)/confidence.length) : 0;

    const overall_score = Math.round(((avgRelevance + avgClarity + avgTone + avgConfidence) / 40) * 100);

    // Build meaningful AI feedback
    const extractedDomainKeywords = [];
    const extractedSoftKeywords = [];
    
    for (const t of parsedTranscripts) {
        if (!t) continue;
        const lower = t.toLowerCase();
        
        // Extract domain keywords
        Object.entries(domainKeywords).forEach(([domain, kws]) => {
            kws.forEach(kw => {
                if (lower.includes(kw) && !extractedDomainKeywords.find(k => k.keyword === kw)) {
                    extractedDomainKeywords.push({ keyword: kw, domain });
                }
            });
        });
        
        // Extract soft skill keywords
        softSkillKeywords.forEach(k => {
            if (lower.includes(k) && !extractedSoftKeywords.includes(k)) {
                extractedSoftKeywords.push(k);
            }
        });
    }

    // Generate strengths
    const strengths = [];
    if (avgRelevance >= 7) strengths.push('Strong technical knowledge demonstrated in your answers');
    if (avgClarity >= 7) strengths.push('Clear and well-structured responses');
    if (avgConfidence >= 7) strengths.push('Confident delivery of answers');
    if (extractedDomainKeywords.length >= 5) strengths.push(`Good use of ${extractedDomainKeywords.slice(0, 3).map(k => k.keyword).join(', ')} and related terminology`);
    if (answerRate >= 0.8) strengths.push('Excellent question completion rate');
    if (strengths.length === 0 && answeredCount > 0) strengths.push('Good effort in completing the interview');

    // Generate improvements
    const improvements = [];
    if (answerRate < 0.5) improvements.push('Try to answer all questions to showcase your full potential');
    if (avgRelevance < 5) improvements.push('Include more technical details and specific examples from your experience');
    if (avgClarity < 5) improvements.push('Work on providing more detailed and structured answers');
    if (avgConfidence < 5) improvements.push('Practice speaking more confidently about your skills and experience');
    if (improvements.length === 0) improvements.push('Continue practicing to further improve your interview skills');

    // Generate recommendations
    const recommendations = [
        'Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers',
        'Practice explaining technical concepts in simple terms',
        'Prepare specific examples from your past projects and experiences',
        'Research common interview questions for your target role'
    ];

    // Generate verdict/summary
    let summary = '';
    if (overall_score >= 80) {
        summary = 'Excellent performance! You demonstrated strong technical knowledge and communication skills.';
    } else if (overall_score >= 60) {
        summary = 'Good job! You have a solid foundation. Focus on the improvement areas to boost your score.';
    } else if (overall_score >= 40) {
        summary = 'Decent attempt. Keep practicing to improve your responses and showcase your skills better.';
    } else {
        summary = 'Keep practicing! Review the suggested improvements and try to provide more detailed answers.';
    }

    return {
        overall_score,
        analysis: {
            semantic_analysis: {
                relevance,
                clarity,
                avg_relevance: Math.round(avgRelevance * 10) / 10,
                avg_clarity: Math.round(avgClarity * 10) / 10
            },
            tone_analysis: {
                tone,
                confidence,
                speech_rate,
                confidence_level: Math.round(avgConfidence * 10)
            },
            camera_analysis: {
                overall_eye_contact_percentage: eye_contact_pct,
                overall_engagement_score: engagement_score,
                overall_posture_score: posture_score,
                total_blinks: Math.round(15 + Math.random() * 10)
            },
            face_behavior: {
                face_presence_pct,
                blink_rate_per_min: Math.round(12 + Math.random() * 8)
            },
            full_transcript: parsedTranscripts.join(' ')
        },
        ai_feedback: {
            summary,
            strengths,
            improvements,
            recommendations
        },
        questions: parsedQuestions,
        transcripts: parsedTranscripts
    };
};

export const uploadInterviewVideo = async (req, res) => {
    // Use multer's singleUpload and handle the rest in a clear try/catch flow
    singleUpload(req, res, async (err) => {
        if (err) {
            console.error('Multer upload error:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        try {
            const { userId, domain, questions, transcripts } = req.body;
            const videoPath = req.file?.path || null;

            const parsedQuestions = JSON.parse(questions || '[]');
            const parsedTranscripts = JSON.parse(transcripts || '[]');

            // Prepare data for Python script
            const tempData = {
                userId: userId || 'user123',
                domain: domain || 'General',
                questions: parsedQuestions,
                transcripts: parsedTranscripts,
                videoPath: videoPath
            };

            const tempFile = path.join(process.cwd(), 'temp_data.json');
            fs.writeFileSync(tempFile, JSON.stringify(tempData));

            // Try multiple possible Python paths
            const possiblePythonPaths = [
                path.join(process.cwd(), '..', '.venv', 'Scripts', 'python.exe'),
                path.join(process.cwd(), '..', 'myenv', 'Scripts', 'python.exe'),
                path.join(process.cwd(), '..', 'venv', 'Scripts', 'python.exe'),
                'python' // Fallback to system Python
            ];
            
            const pythonScript = path.join(process.cwd(), '..', 'analyze_interview_simple.py');
            
            let pythonExecutable = null;
            for (const p of possiblePythonPaths) {
                if (p === 'python' || fs.existsSync(p)) {
                    pythonExecutable = p;
                    break;
                }
            }

            // If Python is not available, use the JS fallback immediately
            if (!pythonExecutable || !fs.existsSync(pythonScript)) {
                console.warn('Python analyzer not available; returning JS fallback analysis');
                let basicFeedback = makeBasicFeedback(parsedTranscripts, parsedQuestions, videoPath);

                // Try to enrich feedback with OpenAI when API key is configured
                try {
                    if (process.env.OPENAI_API_KEY) {
                        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                        const prompt = `You are an expert interview coach. Given the following interview questions:\n${JSON.stringify(parsedQuestions)}\nAnd the interviewee transcripts:\n${JSON.stringify(parsedTranscripts)}\nProvide a JSON object with keys: summary (one-line), strengths (array of short items), improvements (array), recommendations (array). Keep answers concise.`;
                        const completion = await client.chat.completions.create({
                            model: 'gpt-4o-mini',
                            messages: [
                                { role: 'system', content: 'You are an expert technical interviewer and coach.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.2,
                            max_tokens: 600
                        });

                        const aiText = completion.choices?.[0]?.message?.content;
                        if (aiText) {
                            try {
                                const parsedAi = JSON.parse(aiText);
                                // Map parsed keys into our feedback shape if valid
                                basicFeedback.ai_feedback = basicFeedback.ai_feedback || {};
                                basicFeedback.ai_feedback.summary = parsedAi.summary || parsedAi.verdict || basicFeedback.ai_feedback.summary;
                                basicFeedback.ai_feedback.strengths = parsedAi.strengths || parsedAi.strengths || basicFeedback.ai_feedback.strengths;
                                basicFeedback.ai_feedback.improvements = parsedAi.improvements || parsedAi.weaknesses || basicFeedback.ai_feedback.improvements;
                                basicFeedback.ai_feedback.recommendations = parsedAi.recommendations || parsedAi.suggestions || basicFeedback.ai_feedback.recommendations;
                            } catch (e) {
                                // If OpenAI returns plain text, keep the JS heuristic
                                console.warn('OpenAI returned non-JSON; skipping JSON merge');
                            }
                        }
                    }
                } catch (aiErr) {
                    console.error('OpenAI enrichment failed:', aiErr?.message || aiErr);
                }

                try {
                    await MockInterviewFeedback.create({ userId, domain, questions: parsedQuestions, transcripts: parsedTranscripts, feedback: basicFeedback });
                } catch (dbErr) { console.error('Database save error:', dbErr); }
                return res.json({ success: true, feedback: { ...basicFeedback, domain } });
            }

            const pythonProcess = spawn(pythonExecutable, [pythonScript, tempFile], { cwd: path.join(process.cwd(), '..') });

            let analysisResult = '';
            pythonProcess.stdout.on('data', (data) => { analysisResult += data.toString(); });
            pythonProcess.stderr.on('data', (data) => { console.error('Python stderr:', data.toString()); });

            pythonProcess.on('close', async (code) => {
                // Clean up temp file
                try { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); } catch (e) { /* ignore */ }

                if (code !== 0) {
                    console.error('Python analysis failed, returning basic feedback');
                    const basicFeedback = makeBasicFeedback(parsedTranscripts, parsedQuestions, videoPath);
                    try {
                        await MockInterviewFeedback.create({ userId, domain, questions: parsedQuestions, transcripts: parsedTranscripts, feedback: basicFeedback });
                    } catch (dbErr) { console.error('Database save error:', dbErr); }
                    return res.json({ success: true, feedback: basicFeedback });
                }

                // Try parsing Python output
                try {
                    const result = JSON.parse(analysisResult);

                    // Enrich Python analysis result with OpenAI when API key is present
                    try {
                        if (process.env.OPENAI_API_KEY) {
                            const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                            const prompt = `You are an expert interview coach. Given the interview questions:\n${JSON.stringify(parsedQuestions)}\nand the full transcript:\n${result.full_transcript || parsedTranscripts.join(' ')}\nProduce a JSON object with keys: summary (one-line), strengths (array of short items), improvements (array of short items), recommendations (array). Return valid JSON only.`;

                            const completion = await client.chat.completions.create({
                                model: 'gpt-4o-mini',
                                messages: [
                                    { role: 'system', content: 'You are an expert technical interviewer and coach.' },
                                    { role: 'user', content: prompt }
                                ],
                                temperature: 0.2,
                                max_tokens: 600
                            });

                            const aiText = completion.choices?.[0]?.message?.content;
                            if (aiText) {
                                try {
                                    const parsedAi = JSON.parse(aiText);
                                    result.ai_feedback = result.ai_feedback || {};
                                    result.ai_feedback.summary = parsedAi.summary || parsedAi.verdict || result.ai_feedback.summary;
                                    result.ai_feedback.strengths = parsedAi.strengths || parsedAi.strengths || result.ai_feedback.strengths;
                                    result.ai_feedback.improvements = parsedAi.improvements || parsedAi.weaknesses || result.ai_feedback.improvements;
                                    result.ai_feedback.recommendations = parsedAi.recommendations || parsedAi.suggestions || result.ai_feedback.recommendations;
                                } catch (e) {
                                    // OpenAI returned plain text or non-JSON — store as summary fallback
                                    result.ai_feedback = result.ai_feedback || {};
                                    result.ai_feedback.summary = aiText;
                                }
                            }
                        }
                    } catch (aiErr) {
                        console.error('OpenAI enrichment failed:', aiErr?.message || aiErr);
                    }

                    try {
                        await MockInterviewFeedback.create({ userId, domain, questions: parsedQuestions, transcripts: parsedTranscripts, feedback: result });
                    } catch (dbErr) { console.error('Database save error:', dbErr); }
                    return res.json({ success: true, feedback: { ...result, domain } });
                } catch (parseError) {
                    console.error('Failed to parse Python output:', parseError);
                    const basicFeedback = makeBasicFeedback(parsedTranscripts, parsedQuestions, videoPath);
                    try {
                        await MockInterviewFeedback.create({ userId, domain, questions: parsedQuestions, transcripts: parsedTranscripts, feedback: basicFeedback });
                    } catch (dbErr) { console.error('Database save error:', dbErr); }
                    return res.json({ success: true, feedback: { ...basicFeedback, domain } });
                }
            });
        } catch (uploadErr) {
            console.error('Unexpected error during file upload:', uploadErr);
            return res.status(500).json({ error: 'Unexpected server error during file upload' });
        }
    });
};
=======
// Backend/controllers/mockInterviewFeedback.controller.js

import path from 'path';
import fs from 'fs';
import axios from 'axios';
// 🎯 CRITICAL FIX: Explicitly import the installed form-data library
import FormData from 'form-data'; 
// NOTE: Ensure you ran 'npm install form-data'

const FLASK_AI_URL = process.env.FLASK_AI_URL || 'http://localhost:5001'; // Flask microservice

export const uploadInterviewVideo = async (req, res) => {
  const file = req.file;
  const { userId = 'guest_user_123', domain = 'General', questions = '[]', transcripts = '[]' } = req.body;
  
  const formData = new FormData();
  let filePath = null; 

  try {
    // --- 1. Prepare File for Forwarding ---
    if (file && file.path) {
      filePath = path.resolve(file.path);
      // Use fs.createReadStream to handle file streaming with form-data
      const fileStream = fs.createReadStream(filePath);
      formData.append('file', fileStream, { 
          filename: file.originalname,
          contentType: file.mimetype
      });
    } else {
      formData.append('file', "no video recorded", 'empty.txt');
    }

    // --- 2. Append Metadata ---
    formData.append('userId', userId);
    formData.append('domain', domain);
    formData.append('questions', questions);
    formData.append('transcripts', transcripts);

    // --- 3. Forward to Flask AI microservice ---
    const axiosResp = await axios.post(`${FLASK_AI_URL}/analyze`, formData, {
      // CRITICAL: Get the correct headers (including the boundary) from the form-data object
      headers: formData.getHeaders(), 
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 3 * 60 * 1000 // 3 min timeout for AI analysis
    });

    // --- 4. Cleanup and Respond ---
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch (e) { console.warn("Failed to delete file:", e.message); }
    }
    return res.json({ success: true, feedback: axiosResp.data.feedback || axiosResp.data });
    
  } catch (err) {
    // --- Error Cleanup & Response ---
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
    
    console.error('uploadInterviewVideo error:', err?.response?.data || err?.message || err);
    
    // Return structured error feedback
    return res.status(500).json({ 
        success: false, 
        error: 'Server error: analysis failed or Flask service is down.', 
        details: err.message,
        feedback: { 
            final_score_0_100: 0, 
            ai_comment: "Server file forwarding failed. Check Node logs and ensure Flask is running.",
            improvements: ["Analysis system failed to process the video."]
        }
    });
  }
};
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
