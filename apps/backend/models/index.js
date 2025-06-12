const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Tag = require('./Tag');
const ArticleTag = require('./ArticleTag');
const Comment = require('./Comment');

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

module.exports = { User, Category, Article, Tag, ArticleTag, Comment }; 