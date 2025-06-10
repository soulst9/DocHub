require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(express.json());

console.log(process.env.DB_HOST);

// 간단한 health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 서버 및 DB 동기화
sequelize.sync({ alter: true })
  .then(() => {
    console.log('DB 및 테이블이 성공적으로 생성되었습니다.');
    app.listen(3000, () => {
      console.log('Express 서버가 3000번 포트에서 실행 중입니다.');
    });
  })
  .catch(err => {
    console.error('DB 동기화 실패:', err);
  }); 