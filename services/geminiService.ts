import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Safe check for process.env in various environments
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // In a real Vercel deployment, env vars should be handled by the build process.
  // If this is a client-side only demo without build-time replacement:
  // console.warn("API Key not found in process.env");
  return ""; 
};

const createClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
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
