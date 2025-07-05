import { Router } from 'express';
import multer from 'multer';

import {
  generateApplicationFromTranscription,
  generateTextContent,
  transcribeAudioFile,
  convertTextToSpeech,
} from '../controllers/genAIController.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/text', generateTextContent);
router.post('/application-form', generateApplicationFromTranscription);
router.post('/speech-to-text', transcribeAudioFile);
// router.post('/audio', upload.single('audio'), transcribeAudioFile);
router.post('/text-to-speech', convertTextToSpeech);

export default router;
