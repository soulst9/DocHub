const sequelize = require('./config/database');

async function addFavoriteColumn() {
  try {
    console.log('isFavorite 컬럼 추가 시작...');
    
    // 컬럼이 이미 존재하는지 확인
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'articles' 
      AND COLUMN_NAME = 'isFavorite'
    `);
    
    if (results.length > 0) {
      console.log('isFavorite 컬럼이 이미 존재합니다.');
      return;
    }
    
    // 컬럼 추가
    await sequelize.query(`
      ALTER TABLE articles 
      ADD COLUMN isFavorite BOOLEAN DEFAULT false
    `);
    
    console.log('✅ isFavorite 컬럼이 성공적으로 추가되었습니다.');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

addFavoriteColumn(); 