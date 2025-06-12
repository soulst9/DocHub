const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ArticleVersion = sequelize.define('ArticleVersion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  version_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const value = this.getDataValue('tags');
      return value ? (typeof value === 'string' ? JSON.parse(value) : value) : [];
    },
    set(value) {
      this.setDataValue('tags', Array.isArray(value) ? value : []);
    },
  },
  links: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const value = this.getDataValue('links');
      return value ? (typeof value === 'string' ? JSON.parse(value) : value) : [];
    },
    set(value) {
      this.setDataValue('links', Array.isArray(value) ? value : []);
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
}, {
  tableName: 'article_versions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// 관계 설정을 위한 함수
ArticleVersion.associate = (models) => {
  // Article과의 관계
  ArticleVersion.belongsTo(models.Article, {
    foreignKey: 'article_id',
    as: 'article',
  });
  
  // Category와의 관계
  if (models.Category) {
    ArticleVersion.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'Category',
    });
  }
  
  // User와의 관계
  if (models.User) {
    ArticleVersion.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User',
    });
  }
};

module.exports = ArticleVersion; 