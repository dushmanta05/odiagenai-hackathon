import axios from 'axios';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const textToSpeech = async (text, speaker = 'manisha', languageCode = 'od-IN') => {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Text is required and must be a string');
    }

    const requestData = {
      text: text,
      target_language_code: languageCode,
      speaker: speaker,
    };

    const response = await axios.post('https://api.sarvam.ai/text-to-speech', requestData, {
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const audioBase64 = response.data.audios[0];
    const audioBuffer = Buffer.from(audioBase64, 'base64');

    const tempDir = path.resolve(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const audioFileName = `tts_output_${timestamp}.wav`;
    const audioPath = path.join(tempDir, audioFileName);

    fs.writeFileSync(audioPath, audioBuffer);

    return {
      success: true,
      data: {
        request_id: response.data.request_id,
        audioPath: audioPath,
        audioFileName: audioFileName,
        audioUrl: `/temp/${audioFileName}`,
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: 'Text-to-speech conversion failed.',
      error: error.response?.data?.message || error.message,
    };
  }
};
