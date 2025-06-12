const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const ArticleVersion = require('./ArticleVersion');
const Tag = require('./Tag');
const ArticleTag = require('./ArticleTag');
const Comment = require('./Comment');

// 모델 객체 생성
const models = {
  User,
  Category,
  Article,
  ArticleVersion,
  Tag,
  ArticleTag,
  Comment,
};

// associate 함수 호출 (있는 경우)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { User, Category, Article, ArticleVersion, Tag, ArticleTag, Comment }; 