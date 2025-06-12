const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, {
  tableName: 'tags',
  timestamps: false,
});

// 관계 설정을 위한 함수
Tag.associate = (models) => {
  if (models.Article && models.ArticleTag) {
    Tag.belongsToMany(models.Article, { 
      through: models.ArticleTag, 
      foreignKey: 'tagId' 
    });
  }
};

module.exports = Tag; 