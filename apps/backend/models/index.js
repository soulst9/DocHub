const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const Tag = require('./Tag');
const ArticleTag = require('./ArticleTag');

// 관계 설정
User.hasMany(Article, { foreignKey: 'authorId' });
Article.belongsTo(User, { foreignKey: 'authorId' });

Category.hasMany(Article, { foreignKey: 'categoryId' });
Article.belongsTo(Category, { foreignKey: 'categoryId' });

Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'articleId' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tagId' });

module.exports = { User, Category, Article, Tag, ArticleTag }; 