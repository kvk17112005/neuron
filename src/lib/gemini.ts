import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export type ExplanationStyle = 'simple' | 'detailed' | 'exam-oriented' | 'beginner-friendly' | 'real-world';

const stylePrompts: Record<ExplanationStyle, string> = {
  'simple': 'Explain in simple, clear language. Use short sentences and common words.',
  'detailed': 'Provide a thorough, detailed explanation with all relevant concepts and relationships.',
  'exam-oriented': 'Focus on key points that are commonly tested in exams. Include formulas, definitions, and important distinctions.',
  'beginner-friendly': 'Explain as if teaching a complete beginner. Use analogies and step-by-step breakdowns.',
  'real-world': 'Explain using real-world examples and practical applications that make the concept tangible.',
};

export async function askMentor(
  question: string,
  subject: string,
  topic: string,
  style: ExplanationStyle = 'simple'
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemPrompt = `You are NeuroVerse AI Mentor, a friendly and supportive AI tutor. 
You are helping a student learn about ${subject}, specifically the topic: ${topic}.
${stylePrompts[style]}
Always be encouraging and supportive. Use markdown formatting for better readability.
If the student asks a question, provide a clear and helpful answer.
Break down complex ideas into digestible parts.
Use emojis sparingly to keep things engaging.`;

  const result = await model.generateContent({
    contents: [
      { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent's question: ${question}` }] }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });

  const response = result.response;
  return response.text();
}

export async function generateQuiz(
  subject: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 5
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate exactly ${count} multiple-choice quiz questions about ${topic} in ${subject}.
Difficulty level: ${difficulty}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function explainSimulation(
  simulationType: string,
  parameters: Record<string, number>,
  question: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const paramStr = Object.entries(parameters)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

  const prompt = `You are NeuroVerse AI Mentor helping a student understand an interactive simulation.
Simulation type: ${simulationType}
Current parameters: ${paramStr}
Student's question: ${question}

Provide a clear, educational explanation. Use markdown formatting.
Relate the simulation parameters to the underlying concept.
Be encouraging and help them develop intuition about the concept.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getStudyRecommendations(
  completedTopics: string[],
  weakTopics: string[],
  subject: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `As NeuroVerse AI Mentor, analyze a student's progress in ${subject} and recommend next steps.

Completed topics: ${completedTopics.join(', ') || 'None yet'}
Weak topics: ${weakTopics.join(', ') || 'None identified'}

Provide:
1. A brief assessment of their current level
2. Top 3 recommended topics to study next
3. Specific advice for improving weak areas
4. An encouraging message

Use markdown formatting. Be supportive and specific.
Return your response as helpful guidance, not JSON.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function analyzeSkillMatch(
  user1Skills: string[],
  user1Wants: string[],
  user2Skills: string[],
  user2Wants: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Analyze why these two learners would be a good SkillSwap match:

Learner A knows: ${user1Skills.join(', ')}
Learner A wants to learn: ${user1Wants.join(', ')}

Learner B knows: ${user2Skills.join(', ')}
Learner B wants to learn: ${user2Wants.join(', ')}

In 2-3 sentences, explain why they would benefit from connecting and learning from each other. Be specific about which skills they can exchange.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
