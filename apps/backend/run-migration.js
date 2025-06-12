const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');

async function runMigration() {
  try {
    console.log('🔄 마이그레이션 시작...');
    
    // 마이그레이션 테이블이 없으면 생성
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL PRIMARY KEY
      )
    `);
    
    // 이미 실행된 마이그레이션인지 확인
    const [results] = await sequelize.query(`
      SELECT name FROM SequelizeMeta 
      WHERE name = '20241212-add-isfavorite-to-articles.js'
    `);
    
    if (results.length > 0) {
      console.log('✅ 마이그레이션이 이미 실행되었습니다.');
      return;
    }
    
    // isFavorite 컬럼이 이미 존재하는지 확인
    const [columns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'articles' 
      AND COLUMN_NAME = 'isFavorite'
    `);
    
    if (columns.length === 0) {
      // 컬럼 추가
      await sequelize.query(`
        ALTER TABLE articles 
        ADD COLUMN isFavorite BOOLEAN DEFAULT false NOT NULL
      `);
      console.log('✅ isFavorite 컬럼이 추가되었습니다.');
    } else {
      console.log('✅ isFavorite 컬럼이 이미 존재합니다.');
    }
    
    // 마이그레이션 기록 추가
    await sequelize.query(`
      INSERT INTO SequelizeMeta (name) 
      VALUES ('20241212-add-isfavorite-to-articles.js')
    `);
    
    console.log('🎉 마이그레이션이 성공적으로 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 