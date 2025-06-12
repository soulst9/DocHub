const service = require('./service');
const { handleError } = require('./error');

exports.createCategory = async (req, res) => {
  try {
    const category = await service.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await service.getCategories();
    res.json(categories);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await service.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await service.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const result = await service.deleteCategory(req.params.id);
    if (!result) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
}; 