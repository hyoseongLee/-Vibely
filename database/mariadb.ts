import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

pool.getConnection((err, connection: mysql.PoolConnection | undefined) => {
  if (err) {
    console.error('MariaDB 연결 오류:', err);
  } else if (connection) {
    console.log('MariaDB 연결 성공');
    connection.release();
  }
});

export default pool;
