import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';  // routes/index.ts import

// 환경변수 설정
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

console.log(' app.ts 진입');
// 라우트 연결 (예: routes/index.ts)
 app.use('/', routes);

export default app;
