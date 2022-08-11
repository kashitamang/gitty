const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { agent } = require('supertest');

//mock thing
jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('#GET should login and redirect users to /api/v1/github/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    // console.log('res.body', res.body);
  });

  it('#GET /posts, authenticated users can see a list of posts at /api/v1/posts', async () => {
    await request
      .agent(app)
      .get('/api/v1/github/callback?code=42');
    const res = await request.agent(app).get('/api/v1/posts');

    expect(res.status).toBe(200);
  });

});
