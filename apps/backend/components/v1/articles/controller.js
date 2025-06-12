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

exports.toggleFavorite = async (req, res) => {
  try {
    const article = await service.toggleFavorite(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

// 버전 관리 관련 컨트롤러
exports.getVersions = async (req, res) => {
  try {
    const versions = await service.getVersions(req.params.id);
    res.json(versions);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getVersion = async (req, res) => {
  try {
    const version = await service.getVersionById(req.params.id, req.params.versionNumber);
    if (!version) return res.status(404).json({ message: 'Version not found' });
    res.json(version);
  } catch (err) {
    handleError(res, err);
  }
};

exports.restoreVersion = async (req, res) => {
  try {
    const article = await service.restoreVersion(req.params.id, req.params.versionNumber);
    if (!article) return res.status(404).json({ message: 'Version not found' });
    res.json(article);
  } catch (err) {
    handleError(res, err);
  }
};

// 통계 조회 컨트롤러
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await service.getStatistics();
    res.json(statistics);
  } catch (err) {
    handleError(res, err);
  }
}; 