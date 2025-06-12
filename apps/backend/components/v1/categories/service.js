const { Category } = require('../../../models');

exports.createCategory = async (data) => {
  return Category.create({
    name: data.name,
    description: data.description,
  });
};

exports.getCategories = async () => {
  return Category.findAll();
};

exports.getCategoryById = async (id) => {
  return Category.findByPk(id);
};

exports.updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  await category.update({
    name: data.name,
    description: data.description,
  });
  return category;
};

exports.deleteCategory = async (id) => {
  const deleted = await Category.destroy({ where: { id } });
  return deleted > 0;
}; 