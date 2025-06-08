import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MariaDB 연결 성공');
    connection.release(); // 꼭 연결 해제해 주세요
  } catch (err) {
    console.error('MariaDB 연결 오류:', err);
  }
})();

export default pool;
