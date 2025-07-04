import FormData from 'form-data';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const transcribeAudio = async () => {
  try {
    const audioPath = path.resolve(__dirname, '../temp/audio.mp3');

    if (!fs.existsSync(audioPath)) {
      throw new Error(`Audio file not found at ${audioPath}`);
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('language_code', 'od-IN');
    formData.append('model', 'saarika:v2.5');

    const response = await axios.default.post('https://api.sarvam.ai/speech-to-text', formData, {
      headers: {
        'api-subscription-key': process.env.SARVAM_API_KEY,
        ...formData.getHeaders(),
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error:', error);
    return {
      success: false,
      message: 'Speech-to-text conversion failed.',
      error: error.response?.data?.message || error.message,
    };
  }
};
