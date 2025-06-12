const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  content: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  authorName: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    defaultValue: '익명'
  },
  authorEmail: { 
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
}, {
  tableName: 'comments',
  timestamps: true,
});

// 관계 설정을 위한 함수
Comment.associate = (models) => {
  if (models.Article) {
    Comment.belongsTo(models.Article, { 
      foreignKey: 'articleId' 
    });
  }
};

module.exports = Comment; 