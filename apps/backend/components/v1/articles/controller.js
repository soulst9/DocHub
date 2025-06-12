const service = require('./service');
const { handleError } = require('./error');

exports.createArticle = async (req, res) => {
  try {
    const article = await service.createArticle(req.body);
    res.status(201).json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await service.getArticles();
    res.json(articles);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await service.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await service.updateArticle(req.params.id, req.body);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const result = await service.deleteArticle(req.params.id);
    if (!result) return res.status(404).json({ message: 'Article not found' });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
}; 