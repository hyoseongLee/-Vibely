import app from './app';

console.log('server.ts 진입');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
