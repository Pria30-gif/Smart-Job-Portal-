import Groq from 'groq-sdk';

const GROQ_KEY = process.env.GROQ_API_KEY || '';

const delay = ms => new Promise(r => setTimeout(r, ms));

export async function generateChatCompletion(promptText, opts = {}) {
  const { retries = 2, timeoutMs = 25000 } = opts;

  // If GROQ available, use it with retries/timeouts
  if (GROQ_KEY) {
    const groq = new Groq({ apiKey: GROQ_KEY });

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const callPromise = groq.chat.completions.create({
          messages: [{ role: 'user', content: promptText }],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.3,
          max_tokens: 1000,
        });

        const aiResponse = await Promise.race([
          callPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Groq timeout')), timeoutMs))
        ]);

        const content = aiResponse.choices[0]?.message?.content;
        if (!content) throw new Error('No content from Groq');
        return content;
      } catch (err) {
        console.warn(`Groq attempt ${attempt + 1} failed:`, err.message || err);
        if (attempt === retries) throw err;
        await delay(1000 * (attempt + 1));
      }
    }
  }

  // Local fallback: return structured JSON string usable by resumeRoutes
  try {
    const lower = (promptText || '').toLowerCase();
    const known = ['javascript','react','node','python','sql','mongodb','express','aws','docker','kubernetes','html','css','java'];
    const skills = known.filter(k => lower.includes(k)).map(s => s.charAt(0).toUpperCase()+s.slice(1));

    // Allow ATS score to reach 100 (was previously capped at 95)
    const atsScore = Math.min(100, Math.max(20, Math.round((skills.length / 6) * 100)));
    const matchPercentage = Math.round(atsScore * 0.9);

    const result = {
      atsScore,
      matchPercentage,
      skills,
      experience: lower.includes('experience') ? 'Has experience' : 'Not clear',
      education: lower.includes('bachelor') || lower.includes('master') ? 'Has degree' : 'Not specified',
      strengths: skills.slice(0,5).map(s => `Strong knowledge of ${s}`),
      weaknesses: skills.length === 0 ? ['Add technical skills and keywords'] : [],
      keywordsMatched: skills,
      suggestions: ['Add quantifiable achievements', 'Include relevant keywords in summary'],
      summary: `Lightweight analysis: found ${skills.length} skills.`
    };

    return JSON.stringify(result);
  } catch (e) {
    console.error('Fallback provider failed:', e);
    throw e;
  }
}

export default { generateChatCompletion };
