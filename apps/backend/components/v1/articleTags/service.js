const { ArticleTag } = require('../../../models');

exports.addTagToArticle = async ({ articleId, tagId }) => {
  return ArticleTag.create({ articleId, tagId });
};

exports.removeTagFromArticle = async ({ articleId, tagId }) => {
  const deleted = await ArticleTag.destroy({ where: { articleId, tagId } });
  return deleted > 0;
};

exports.getArticleTags = async (query) => {
  const where = {};
  if (query.articleId) where.articleId = query.articleId;
  if (query.tagId) where.tagId = query.tagId;
  return ArticleTag.findAll({ where });
};

exports.getArticleTagById = async (id) => {
  return ArticleTag.findByPk(id);
}; 