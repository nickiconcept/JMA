import { GoogleGenAI } from "@google/genai";
import { Student, Assessment } from "../types";

const createClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing!");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStudentRemark = async (studentName: string, subject: string, score: number, grade: string): Promise<string> => {
  const ai = createClient();
  if (!ai) return "Excellent performance. Keep it up.";

  try {
    const prompt = `
      You are a Teacher at a Nigerian Secondary School called Jere Model Academy.
      Write a short, professional, and encouraging 1-sentence remark for a student's report card.
      
      Student: ${studentName}
      Subject: ${subject}
      Total Score: ${score}/100
      Grade: ${grade}
      
      The remark should be suitable for a formal school report. Avoid slang.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 50,
      }
    });

    return response.text?.trim() || "Good effort shown.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Result noted.";
  }
};
