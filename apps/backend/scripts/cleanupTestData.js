const { User, Article, Category, Tag, ArticleTag } = require('../models');
const sequelize = require('../config/database');

async function cleanup() {
  try {
    // 테스트용 데이터 삭제 (예: testuser, test@example.com 등)
    await ArticleTag.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await Article.destroy({ where: {} });
    await Category.destroy({ where: {} });
    await User.destroy({ where: { username: 'testuser' } });
    console.log('테스트 데이터 정리 완료');
  } catch (err) {
    console.error('테스트 데이터 정리 실패:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

cleanup(); 