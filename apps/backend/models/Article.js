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
  
  // 카테고리 관계
  if (models.Category) {
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'Category',
    });
  }
  
  // 사용자 관계
  if (models.User) {
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'User',
    });
  }
  
  // 태그 관계
  if (models.Tag && models.ArticleTag) {
    Article.belongsToMany(models.Tag, { 
      through: models.ArticleTag, 
      foreignKey: 'articleId' 
    });
  }
  
  // 댓글 관계
  if (models.Comment) {
    Article.hasMany(models.Comment, { 
      foreignKey: 'articleId', 
      onDelete: 'CASCADE' 
    });
  }
};

module.exports = Article; 