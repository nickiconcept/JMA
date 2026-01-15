
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Support Vite
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // Support Standard Node / CRA / Next.js
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY;
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
  }

  return ""; 
};

const createClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateGeneralRemark = async (
  studentName: string, 
  role: 'PRINCIPAL' | 'FORM_MASTER', 
  average: number, 
  totalScore: number
): Promise<string> => {
  const ai = createClient();
  if (!ai) return "Outstanding performance. Keep it up.";

  try {
    const roleTitle = role === 'PRINCIPAL' ? 'Principal' : 'Form Master';
    const performanceContext = average >= 70 ? "Excellent" : average >= 50 ? "Good" : "Needs Improvement";

    const prompt = `
      You are the ${roleTitle} at Jere Model Academy.
      Write a short, professional, and specific 1-2 sentence general remark for a student's report card.
      
      Student: ${studentName}
      Term Average: ${average}%
      Performance Category: ${performanceContext}
      
      The remark should be encouraging but honest based on the score. Avoid slang. Do not include the score in the text, just the sentiment.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
      }
    });

    return response.text?.trim() || "A good result overall.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Result noted.";
  }
};
