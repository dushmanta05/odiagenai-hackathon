import { Type } from '@google/genai';

export const bilingualApplicationSchema = {
  responseMimeType: 'application/json',
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      english: { type: Type.STRING },
      odia: { type: Type.STRING },
    },
    propertyOrdering: ['english', 'odia'],
  },
};
