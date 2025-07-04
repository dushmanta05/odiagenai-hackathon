import { generateContent } from '../services/gemini.js';
import { transcribeAudio } from '../services/transcribe.js';

const generateTextContent = async (req, res) => {
  try {
    const response = await generateContent();
    return res
      .status(200)
      .json({ success: true, message: 'Content generated successfully.', data: response });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again later.',
      error: 'Content generation failed.',
    });
  }
};

const transcribeAudioFile = async (req, res) => {
  try {
    // const filePath = req.file.path;
    const transcription = await transcribeAudio();

    if (!transcription?.success) {
      throw new Error(transcription?.error || 'Something went wrong! Please try again later.');
    }
    res.json({ success: true, message: 'Audio transcribed successfully.', data: transcription });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Something went wrong!', error: error?.message });
  }
};

export { generateTextContent, transcribeAudioFile };
