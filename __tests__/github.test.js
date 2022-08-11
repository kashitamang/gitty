const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

//mock user
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

  it('#DELETE signs out a user', async () => {
    const res = await request
      .agent(app)
      .delete('/api/v1/github/callback?code=42');
    // console.log('res.body', res.body);

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
