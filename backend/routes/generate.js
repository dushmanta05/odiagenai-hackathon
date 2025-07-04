import { Router } from 'express';
import multer from 'multer';

import { generateTextContent, transcribeAudioFile } from '../controllers/genAIController.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/text', generateTextContent);
router.post('/audio', transcribeAudioFile);
// router.post('/audio', upload.single('audio'), transcribeAudioFile);

export default router;
