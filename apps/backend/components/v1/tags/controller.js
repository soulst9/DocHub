const service = require('./service');
const { handleError } = require('./error');

exports.createTag = async (req, res) => {
  try {
    const tag = await service.createTag(req.body);
    res.status(201).json(tag);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await service.getTags();
    res.json(tags);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getTagById = async (req, res) => {
  try {
    const tag = await service.getTagById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateTag = async (req, res) => {
  try {
    const tag = await service.updateTag(req.params.id, req.body);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const result = await service.deleteTag(req.params.id);
    if (!result) return res.status(404).json({ message: 'Tag not found' });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
}; 