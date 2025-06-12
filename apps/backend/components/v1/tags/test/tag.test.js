const request = require('supertest');
const app = require('../../../app');
const { Tag } = require('../../../models');

describe('Tag API', () => {
  let tagId;
  const testTag = {
    name: '테스트태그',
    description: '테스트용 태그',
  };

  afterAll(async () => {
    if (tagId) await Tag.destroy({ where: { id: tagId } });
  });

  it('POST /api/v1/tags - 태그 생성', async () => {
    const res = await request(app)
      .post('/api/v1/tags')
      .send(testTag);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(testTag.name);
    tagId = res.body.id;
  });

  it('GET /api/v1/tags - 태그 목록', async () => {
    const res = await request(app).get('/api/v1/tags');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/tags/:id - 태그 상세', async () => {
    const res = await request(app).get(`/api/v1/tags/${tagId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(tagId);
  });

  it('PUT /api/v1/tags/:id - 태그 수정', async () => {
    const res = await request(app)
      .put(`/api/v1/tags/${tagId}`)
      .send({ name: '수정된태그' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('수정된태그');
  });

  it('DELETE /api/v1/tags/:id - 태그 삭제', async () => {
    const res = await request(app).delete(`/api/v1/tags/${tagId}`);
    expect(res.statusCode).toBe(204);
  });
}); 