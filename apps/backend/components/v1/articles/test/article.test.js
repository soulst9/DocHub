const request = require('supertest');
const app = require('../../../app');
const { Article } = require('../../../models');

describe('Article API', () => {
  let articleId;
  const testArticle = {
    title: '테스트 문서',
    content: '테스트 내용',
    categoryId: 1,
    authorId: 1,
  };

  afterAll(async () => {
    if (articleId) await Article.destroy({ where: { id: articleId } });
  });

  it('POST /api/v1/articles - 문서 생성', async () => {
    const res = await request(app)
      .post('/api/v1/articles')
      .send(testArticle);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(testArticle.title);
    articleId = res.body.id;
  });

  it('GET /api/v1/articles - 문서 목록', async () => {
    const res = await request(app).get('/api/v1/articles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/articles/:id - 문서 상세', async () => {
    const res = await request(app).get(`/api/v1/articles/${articleId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(articleId);
  });

  it('PUT /api/v1/articles/:id - 문서 수정', async () => {
    const res = await request(app)
      .put(`/api/v1/articles/${articleId}`)
      .send({ title: '수정된 제목' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('수정된 제목');
  });

  it('DELETE /api/v1/articles/:id - 문서 삭제', async () => {
    const res = await request(app).delete(`/api/v1/articles/${articleId}`);
    expect(res.statusCode).toBe(204);
  });
}); 