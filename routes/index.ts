import express from 'express';
import { login, callback } from '../controllers/auth.controller';

const router = express.Router();

router.get('/auth/login', login);
router.get('/auth/callback', callback);

export default router;
