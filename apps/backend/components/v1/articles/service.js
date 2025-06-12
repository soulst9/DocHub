const { Article, User, Category } = require('../../../models');

exports.createArticle = async (data) => {
  // authorId 검증 및 기본값 설정
  let authorId = data.authorId || 1;
  if (authorId) {
    const userExists = await User.findByPk(authorId);
    if (!userExists) {
      authorId = 1; // 기본 사용자 ID
    }
  }

  // categoryId 검증 (선택사항이므로 null 허용)
  let categoryId = data.categoryId || null;
  if (categoryId) {
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      categoryId = null; // 존재하지 않으면 null로 설정
    }
  }

  return Article.create({
    title: data.title,
    content: data.content,
    tags: data.tags,
    categoryId: categoryId,
    authorId: authorId,
  });
};

exports.getArticles = async () => {
  return Article.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      },
      {
        model: User,
        attributes: ['id', 'username']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

exports.getArticleById = async (id) => {
  return Article.findByPk(id, {
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      },
      {
        model: User,
        attributes: ['id', 'username']
      }
    ]
  });
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

exports.toggleFavorite = async (id) => {
  const article = await Article.findByPk(id);
  if (!article) return null;
  
  await article.update({
    isFavorite: !article.isFavorite
  });
  
  return article;
}; 