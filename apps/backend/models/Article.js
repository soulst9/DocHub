const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  title:      { type: DataTypes.STRING(200), allowNull: false },
  content:    { type: DataTypes.TEXT, allowNull: false },
  tags:       { type: DataTypes.JSON },
  links:      { type: DataTypes.JSON },
  isFavorite: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'articles',
  timestamps: true,
});

// 관계 설정을 위한 함수
Article.associate = (models) => {
  // 버전 관계
  Article.hasMany(models.ArticleVersion, {
    foreignKey: 'article_id',
    as: 'versions',
    onDelete: 'CASCADE',
  });
  
  // 기존 관계들
  if (models.Category) {
    Article.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'Category',
    });
  }
  
  if (models.User) {
    Article.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User',
    });
  }
};

module.exports = Article; 