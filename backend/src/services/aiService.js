/**
 * AI Service – Task Auto-Categorization using Groq API (llama-3.3-70b-versatile)
 * Falls back to rule-based heuristic if API key is absent or call fails.
 * 
 * Dual-Mode Architecture:
 *   Mode 1 (AI)        → Context-aware LLM categorization via Groq
 *   Mode 2 (Heuristic) → Keyword-based fallback for 100% offline operation
 */

const CATEGORIES = ['Work', 'Personal', 'Study', 'Health'];
const PRIORITIES  = ['High', 'Medium', 'Low'];

// ── Heuristic fallback ────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  Work:     ['meeting','deadline','report','client','project','email','presentation','office','boss','invoice','budget','sprint','deploy','standup','pr','review','ticket','jira','slack','manager','ceo','stakeholder'],
  Study:    ['read','study','learn','course','exam','assignment','research','book','lecture','homework','quiz','chapter','tutorial','practice','notes','university','college','test','syllabus','revision'],
  Health:   ['gym','workout','doctor','medicine','exercise','run','yoga','diet','sleep','appointment','dentist','hospital','therapy','meditate','steps','calories','water','mental','checkup','vitamin'],
  Personal: ['buy','shop','call','visit','clean','cook','family','friend','pay','bill','travel','vacation','hobby','movie','game','birthday','gift','groceries','rent','laundry'],
};
const PRIORITY_KEYWORDS = {
  High: ['urgent','asap','critical','immediately','deadline','emergency','important','must','today','overdue','priority','tonight','tomorrow','due','submit','final','exam','presentation','now','hurry'],
  Low:  ['someday','maybe','eventually','optional','low priority','nice to have','whenever','no rush','later','free time','leisure'],
};

function heuristicCategorize(title, description = '') {
  const text = `${title} ${description}`.toLowerCase();
  let category = 'Personal', maxMatches = 0;
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    const n = kws.filter(k => text.includes(k)).length;
    if (n > maxMatches) { maxMatches = n; category = cat; }
  }
  let priority = 'Medium';
  for (const [pri, kws] of Object.entries(PRIORITY_KEYWORDS)) {
    if (kws.some(k => text.includes(k))) { priority = pri; break; }
  }
  return { category, priority, reasoning: null, source: 'heuristic' };
}

// ── Groq AI ───────────────────────────────────────────────────────────────────
async function aiCategorize(title, description = '') {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return heuristicCategorize(title, description);
  }

  const prompt = `You are an intelligent task management assistant with expertise in productivity and time management. Analyze the following task carefully and respond ONLY with valid JSON — no markdown, no explanation, no wrapping.

Task title: "${title}"
Task description: "${description || 'N/A'}"

CATEGORY RULES (pick exactly one):
- "Work"     → Professional tasks: meetings, reports, deployments, client work, office duties
- "Personal" → Daily life: shopping, bills, family, travel, hobbies, errands
- "Study"    → Learning & academics: exams, courses, homework, research, reading, tutorials
- "Health"   → Wellness: exercise, doctor visits, medication, diet, mental health, sleep

PRIORITY RULES (pick exactly one):
- "High"   → Has a near deadline (today, tonight, tomorrow, this week), urgent language, exams, submissions, emergencies, or time-critical consequences
- "Medium" → Important but no immediate deadline, standard ongoing tasks
- "Low"    → Optional, someday, leisure, or no time pressure at all

IMPORTANT: If the task mentions "tomorrow", "today", "tonight", "due", "deadline", "exam", "submit", or "test" — it MUST be "High" priority.

Return exactly this JSON structure:
{
  "category": "<Work | Personal | Study | Health>",
  "priority": "<High | Medium | Low>",
  "reasoning": "<one concise sentence explaining the category and priority choice>"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 256,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    const parsed = JSON.parse(text);

    const category  = CATEGORIES.includes(parsed.category) ? parsed.category : 'Personal';
    const priority  = PRIORITIES.includes(parsed.priority)  ? parsed.priority  : 'Medium';
    const reasoning = typeof parsed.reasoning === 'string'  ? parsed.reasoning : null;

    return { category, priority, reasoning, source: 'ai' };
  } catch (err) {
    console.warn('[AI Service] Groq failed, using heuristic:', err.message);
    return heuristicCategorize(title, description);
  }
}

module.exports = { aiCategorize };
