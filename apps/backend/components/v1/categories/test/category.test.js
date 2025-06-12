const request = require('supertest');
const app = require('../../../app');

describe('Category API', () => {
  it('POST /api/categories - 카테고리 생성', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: '테스트카테고리', description: '테스트용' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', '테스트카테고리');
  });

  it('GET /api/categories - 카테고리 목록 조회', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
}); 