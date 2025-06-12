const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name:        { type: DataTypes.STRING(50), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: true,
  updatedAt: false,
});

// 관계 설정을 위한 함수
Category.associate = (models) => {
  if (models.Article) {
    Category.hasMany(models.Article, { 
      foreignKey: 'categoryId' 
    });
  }
};

module.exports = Category; 