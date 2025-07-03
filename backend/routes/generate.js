import { Router } from 'express';

import { generateContent } from '../services/gemini.js';

const router = Router();

router.use('/text', generateContent);
export default router;
