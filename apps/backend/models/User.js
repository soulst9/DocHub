const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'users',
  timestamps: true,
});

// 관계 설정을 위한 함수
User.associate = (models) => {
  if (models.Article) {
    User.hasMany(models.Article, { 
      foreignKey: 'authorId' 
    });
  }
};

module.exports = User; 