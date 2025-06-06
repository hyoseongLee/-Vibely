import express from 'express';
const router = express.Router();

// 기본 테스트 라우트
router.get('/', (req, res) => {
  res.send('vibely');
});


export default router;
