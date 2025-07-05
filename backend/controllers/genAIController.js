import { generateContent, generateStructuredContent } from '../services/gemini.js';
import { transcribeAudio } from '../services/transcribe.js';
import { textToSpeech } from '../services/tts.js';
import { buildSystemPrompt } from '../utils/prompt.js';
import { bilingualApplicationSchema } from '../utils/responseSchema.js';

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

    const prompt = buildSystemPrompt(transcriptText, name);
    const responseSchema = bilingualApplicationSchema;
    const response = await generateStructuredContent(prompt, responseSchema);

    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: response.error || 'Something went wrong! Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      data: response?.data,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong while generating the application.',
    });
  }
};

const convertTextToSpeech = async (req, res) => {
  try {
    const text = 'ଜୁଲାଇ ପାଞ୍ଚ ତାରିଖରେ ରଥଯାତ୍ରା ପାଇଁ ଗୋଟେ ଦରକାର।';

    const speechResult = await textToSpeech(text);

    if (!speechResult?.success) {
      throw new Error(speechResult?.error || 'Something went wrong! Please try again later.');
    }

    res.json({
      success: true,
      message: 'Text converted to speech successfully.',
      data: speechResult?.data,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Something went wrong!', error: error?.message });
  }
};

export {
  generateTextContent,
  transcribeAudioFile,
  generateApplicationFromTranscription,
  convertTextToSpeech,
};
