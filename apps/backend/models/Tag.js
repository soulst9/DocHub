const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
  name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, {
  tableName: 'tags',
  timestamps: false,
});

module.exports = Tag; 