import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const generateContent = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Explain how AI works in a few words',
    });

    return { success: true, data: response };
  } catch (error) {
    console.log(error);
    return { success: false, data: null };
  }
};

export { generateContent };
