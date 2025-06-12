const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  title:      { type: DataTypes.STRING(200), allowNull: false },
  content:    { type: DataTypes.TEXT, allowNull: false },
  tags:       { type: DataTypes.JSON },
}, {
  tableName: 'articles',
  timestamps: true,
});

module.exports = Article; 