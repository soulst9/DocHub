const request = require('supertest');
const app = require('../../../app');
const { ArticleTag } = require('../../../models');

describe('ArticleTag API', () => {
  let articleTagId;
  const testData = {
    articleId: 1,
    tagId: 1,
  };

  afterAll(async () => {
    if (articleTagId) await ArticleTag.destroy({ where: { id: articleTagId } });
  });

  it('POST /api/v1/article-tags - 문서에 태그 연결', async () => {
    const res = await request(app)
      .post('/api/v1/article-tags')
      .send(testData);
    expect(res.statusCode).toBe(201);
    expect(res.body.articleId).toBe(testData.articleId);
    expect(res.body.tagId).toBe(testData.tagId);
    articleTagId = res.body.id;
  });

  it('GET /api/v1/article-tags - 연결 목록', async () => {
    const res = await request(app).get('/api/v1/article-tags');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/article-tags/:id - 연결 상세', async () => {
    const res = await request(app).get(`/api/v1/article-tags/${articleTagId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(articleTagId);
  });

  it('DELETE /api/v1/article-tags - 문서에서 태그 해제', async () => {
    const res = await request(app)
      .delete('/api/v1/article-tags')
      .send(testData);
    expect(res.statusCode).toBe(204);
  });
}); 