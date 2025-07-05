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

const generateStructuredContent = async (prompt, schema) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: schema,
    });

    const textJsonString = response.candidates[0].content.parts[0].text;

    if (!textJsonString) {
      throw new Error('No structured text data found in Gemini response.');
    }
    const parsedJson = JSON.parse(textJsonString);

    return { success: true, data: parsedJson };
  } catch (error) {
    console.error('Gemini generation failed:', error);
    return {
      success: false,
      message: 'Structured content generation failed.',
      error: error?.message,
    };
  }
};

export { generateContent, generateStructuredContent };
