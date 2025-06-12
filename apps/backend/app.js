require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const { User, Category, Article, Tag, ArticleTag, Comment } = require('./models');

const app = express();
app.use(express.json());
app.use(cors()); // CORS 설정 추가

// 정적 파일 서빙 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// v1 라우터 등록
const userRouterV1 = require('./components/v1/users');
const categoryRouterV1 = require('./components/v1/categories');
const articleRouterV1 = require('./components/v1/articles');
const uploadRouterV1 = require('./components/v1/uploads/router');
const commentRouterV1 = require('./comments/router');

app.use('/api/v1/users', userRouterV1);
app.use('/api/v1/categories', categoryRouterV1);
app.use('/api/v1/articles', articleRouterV1);
app.use('/api/v1/uploads', uploadRouterV1);
app.use('/api/v1/comments', commentRouterV1);

console.log(process.env.DB_HOST);

// 간단한 health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 서버 및 DB 동기화 - alter 대신 안전한 옵션 사용
sequelize.sync({ force: false })
  .then(async () => {
    console.log('DB 연결 및 테이블 확인이 완료되었습니다.');
    
    // 기본 데이터 생성
    try {
      // 기본 사용자 생성 (ID: 1)
      const [defaultUser] = await User.findOrCreate({
        where: { id: 1 },
        defaults: {
          username: 'admin',
          email: 'admin@dochub.com',
          password: 'password123' // 실제 운영에서는 해시화 필요
        }
      });
      console.log('기본 사용자 확인/생성 완료:', defaultUser.username);

      // 기본 카테고리 생성
      const [defaultCategory] = await Category.findOrCreate({
        where: { name: '일반' },
        defaults: {
          name: '일반',
          description: '기본 카테고리'
        }
      });
      console.log('기본 카테고리 확인/생성 완료:', defaultCategory.name);

    } catch (err) {
      console.error('기본 데이터 생성 실패:', err);
    }
    
    app.listen(3001, () => {
      console.log('Express 서버가 3001번 포트에서 실행 중입니다.');
    });
  })
  .catch(err => {
    console.error('DB 동기화 실패:', err);
  });

module.exports = app;