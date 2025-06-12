const service = require('./service');
const { handleError } = require('./error');

exports.addTagToArticle = async (req, res) => {
  try {
    const result = await service.addTagToArticle(req.body);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

exports.removeTagFromArticle = async (req, res) => {
  try {
    const result = await service.removeTagFromArticle(req.body);
    if (!result) return res.status(404).json({ message: '연결 정보 없음' });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticleTags = async (req, res) => {
  try {
    const list = await service.getArticleTags(req.query);
    res.json(list);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getArticleTagById = async (req, res) => {
  try {
    const item = await service.getArticleTagById(req.params.id);
    if (!item) return res.status(404).json({ message: '연결 정보 없음' });
    res.json(item);
  } catch (err) {
    handleError(res, err);
  }
}; 