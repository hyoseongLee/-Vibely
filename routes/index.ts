import express from 'express';
import { login, callback } from '../controllers/auth.controller';
import { geminiChatHandler } from '../controllers/gemini.controller';

const router = express.Router();

router.get('/auth/login', login);
router.get('/auth/callback', callback);

router.post('/gemini/chat',geminiChatHandler)
export default router;
