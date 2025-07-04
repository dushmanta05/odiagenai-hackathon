import { generateContent } from '../services/gemini.js';
import { transcribeAudio } from '../services/transcribe.js';
import { buildSystemPrompt } from '../utils/prompt.js';

const generateTextContent = async (req, res) => {
  try {
    const prompt = 'Tell me about Max Verstappen!';
    const response = await generateContent(prompt);
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

const generateApplicationFromTranscription = async (req, res) => {
  try {
    const outputLang = 'odia';
    const name = 'Dushmanta';
    const transcriptionResult = await transcribeAudio();
    if (!transcriptionResult.success) {
      throw new Error(transcriptionResult.error || 'Transcription failed');
    }

    const transcriptText = transcriptionResult?.data?.transcript;

    if (!transcriptText || transcriptText.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Transcribed input is too short or unclear.',
      });
    }

    const prompt = buildSystemPrompt(transcriptText, outputLang, name);
    const response = await generateContent(prompt);
    const applicationText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      success: true,
      data: applicationText.trim(),
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong while generating the application.',
    });
  }
};

export { generateTextContent, transcribeAudioFile, generateApplicationFromTranscription };
