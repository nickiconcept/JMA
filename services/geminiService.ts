

import { GoogleGenAI } from "@google/genai";

const createClient = () => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // Assume this variable is pre-configured, valid, and accessible.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateGeneralRemark = async (
  studentName: string, 
  role: 'PRINCIPAL' | 'FORM_MASTER', 
  average: number, 
  totalScore: number
): Promise<string> => {
  try {
    const ai = createClient();
    
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
      // Removed maxOutputTokens to avoid issues with thinking budget
    });

    return response.text?.trim() || "A good result overall.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Result noted.";
  }
};
