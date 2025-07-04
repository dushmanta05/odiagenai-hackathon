import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
    return { success: false, data: null };
  }
};

export { generateContent };
