const { Tag } = require('../../../models');

exports.createTag = async (data) => {
  return Tag.create({
    name: data.name,
    description: data.description,
  });
};

exports.getTags = async () => {
  return Tag.findAll();
};

exports.getTagById = async (id) => {
  return Tag.findByPk(id);
};

exports.updateTag = async (id, data) => {
  const tag = await Tag.findByPk(id);
  if (!tag) return null;
  await tag.update({
    name: data.name,
    description: data.description,
  });
  return tag;
};

exports.deleteTag = async (id) => {
  const deleted = await Tag.destroy({ where: { id } });
  return deleted > 0;
}; 