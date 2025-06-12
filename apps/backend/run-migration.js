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
    
    // isFavorite 마이그레이션
    const [favoriteResults] = await sequelize.query(`
      SELECT name FROM SequelizeMeta 
      WHERE name = '20241212-add-isfavorite-to-articles.js'
    `);
    
    if (favoriteResults.length === 0) {
      // isFavorite 컬럼이 이미 존재하는지 확인
      const [favoriteColumns] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'articles' 
        AND COLUMN_NAME = 'isFavorite'
      `);
      
      if (favoriteColumns.length === 0) {
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
    } else {
      console.log('✅ isFavorite 마이그레이션이 이미 실행되었습니다.');
    }
    
    // links 마이그레이션
    const [linksResults] = await sequelize.query(`
      SELECT name FROM SequelizeMeta 
      WHERE name = '20241212-add-links-to-articles.js'
    `);
    
    if (linksResults.length === 0) {
      // links 컬럼이 이미 존재하는지 확인
      const [linksColumns] = await sequelize.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'articles' 
        AND COLUMN_NAME = 'links'
      `);
      
      if (linksColumns.length === 0) {
        await sequelize.query(`
          ALTER TABLE articles 
          ADD COLUMN links JSON
        `);
        console.log('✅ links 컬럼이 추가되었습니다.');
      } else {
        console.log('✅ links 컬럼이 이미 존재합니다.');
      }
      
      // 마이그레이션 기록 추가
      await sequelize.query(`
        INSERT INTO SequelizeMeta (name) 
        VALUES ('20241212-add-links-to-articles.js')
      `);
    } else {
      console.log('✅ links 마이그레이션이 이미 실행되었습니다.');
    }
    
    console.log('🎉 모든 마이그레이션이 성공적으로 완료되었습니다!');
    
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