require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Category, Article, Tag, ArticleTag } = require('./models');

const app = express();
app.use(express.json());
app.use(cors()); // CORS 설정 추가

// v1 라우터 등록
const userRouterV1 = require('./components/v1/users');
const categoryRouterV1 = require('./components/v1/categories');
const articleRouterV1 = require('./components/v1/articles');
app.use('/api/v1/users', userRouterV1);
app.use('/api/v1/categories', categoryRouterV1);
app.use('/api/v1/articles', articleRouterV1);

console.log(process.env.DB_HOST);

// 간단한 health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 서버 및 DB 동기화 - alter 대신 안전한 옵션 사용
sequelize.sync({ force: false })
  .then(() => {
    console.log('DB 연결 및 테이블 확인이 완료되었습니다.');
    app.listen(3001, () => {
      console.log('Express 서버가 3001번 포트에서 실행 중입니다.');
    });
  })
  .catch(err => {
    console.error('DB 동기화 실패:', err);
  });

module.exports = app;