import Groq from 'groq-sdk';

export interface AITaskSuggestion {
  priority: 'low' | 'medium' | 'high';
  subtasks: string[];
  estimatedMinutes: number;
}

export const analyzeTask = async (
  title: string,
  description: string
): Promise<AITaskSuggestion> => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `
    Analyze this task and respond ONLY with a JSON object, no explanation:
    Title: "${title}"
    Description: "${description}"

    Respond with exactly this structure:
    {
      "priority": "low" | "medium" | "high",
      "subtasks": ["subtask 1", "subtask 2", "subtask 3"],
      "estimatedMinutes": number
    }

    Rules:
    - priority: based on urgency and importance
    - subtasks: 3 to 5 concrete actionable steps
    - estimatedMinutes: realistic time to complete
  `;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content || '{}';
  const clean = content.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};