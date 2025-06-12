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

module.exports = Category; 