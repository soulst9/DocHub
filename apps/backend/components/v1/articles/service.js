const { Article } = require('../../../models');

exports.createArticle = async (data) => {
  return Article.create({
    title: data.title,
    content: data.content,
    tags: data.tags,
    categoryId: data.categoryId,
    authorId: data.authorId,
  });
};

exports.getArticles = async () => {
  return Article.findAll();
};

exports.getArticleById = async (id) => {
  return Article.findByPk(id);
};

exports.updateArticle = async (id, data) => {
  const article = await Article.findByPk(id);
  if (!article) return null;
  await article.update({
    title: data.title,
    content: data.content,
    tags: data.tags,
    categoryId: data.categoryId,
    authorId: data.authorId,
  });
  return article;
};

exports.deleteArticle = async (id) => {
  const deleted = await Article.destroy({ where: { id } });
  return deleted > 0;
}; 