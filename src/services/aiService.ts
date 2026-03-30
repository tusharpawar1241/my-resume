import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const enhanceTextWithGemini = async (text: string, context: string): Promise<string> => {
  if (!ai || !apiKey) {
    console.warn("Gemini API key is not set. Returning original text.");
    return text;
  }
  
  try {
    const prompt = `You are an expert resume writer. Please professionally rewrite and enhance the following text for a resume's ${context} section. Keep it concise, action-oriented, and professional. Return only the enhanced text without any formatting, markdown, or conversational filler. Original text:\n\n${text}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || text;
  } catch (error) {
    console.error('AI Enhancement Failed', error);
    return text;
  }
};
