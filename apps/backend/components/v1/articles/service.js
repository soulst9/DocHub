const { Article, ArticleVersion, User, Category } = require('../../../models');

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

  const article = await Article.create({
    title: data.title,
    content: data.content,
    tags: data.tags,
    links: data.links,
    categoryId: categoryId,
    authorId: authorId,
  });

  // 첫 번째 버전 생성
  await this.createVersion(article.id, article);

  return article;
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

  // 수정 전 현재 상태를 버전으로 저장
  await this.createVersion(id, article);

  await article.update({
    title: data.title,
    content: data.content,
    tags: data.tags,
    links: data.links,
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

// 버전 관리 관련 함수들
exports.createVersion = async (articleId, articleData) => {
  // 현재 버전 번호 조회
  const lastVersion = await ArticleVersion.findOne({
    where: { article_id: articleId },
    order: [['version_number', 'DESC']]
  });

  const nextVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

  return ArticleVersion.create({
    article_id: articleId,
    version_number: nextVersionNumber,
    title: articleData.title,
    content: articleData.content,
    tags: articleData.tags,
    links: articleData.links,
    category_id: articleData.categoryId,
    user_id: articleData.authorId || 1,
  });
};

exports.getVersions = async (articleId) => {
  return ArticleVersion.findAll({
    where: { article_id: articleId },
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
    order: [['version_number', 'DESC']]
  });
};

exports.getVersionById = async (articleId, versionNumber) => {
  return ArticleVersion.findOne({
    where: { 
      article_id: articleId,
      version_number: versionNumber 
    },
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

exports.restoreVersion = async (articleId, versionNumber) => {
  const version = await this.getVersionById(articleId, versionNumber);
  if (!version) return null;

  const article = await Article.findByPk(articleId);
  if (!article) return null;

  // 현재 상태를 버전으로 저장 (복원 전)
  await this.createVersion(articleId, article);

  // 선택한 버전으로 복원
  await article.update({
    title: version.title,
    content: version.content,
    tags: version.tags,
    links: version.links,
    categoryId: version.category_id,
    authorId: version.user_id,
  });

  return article;
}; 