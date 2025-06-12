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

// 관계 설정
User.hasMany(Article, { foreignKey: 'authorId' });
Article.belongsTo(User, { foreignKey: 'authorId' });

Category.hasMany(Article, { foreignKey: 'categoryId' });
Article.belongsTo(Category, { foreignKey: 'categoryId' });

Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'articleId' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tagId' });

// 댓글 관계 설정
Article.hasMany(Comment, { foreignKey: 'articleId', onDelete: 'CASCADE' });
Comment.belongsTo(Article, { foreignKey: 'articleId' });

// 버전 관계 설정
Article.hasMany(ArticleVersion, { 
  foreignKey: 'article_id', 
  as: 'versions',
  onDelete: 'CASCADE' 
});
ArticleVersion.belongsTo(Article, { 
  foreignKey: 'article_id', 
  as: 'article' 
});

// associate 함수 호출 (있는 경우)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { User, Category, Article, ArticleVersion, Tag, ArticleTag, Comment }; 