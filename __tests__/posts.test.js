const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { agent } = require('supertest');

//mock user
jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('#GET /posts, authenticated users can see a list of posts at /api/v1/posts', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const res = await agent.get('/api/v1/posts');
    // console.log('response body', res.body);

    expect(res.status).toBe(200);

    expect(res.body[0]).toEqual({
      content: expect.any(String),
      created_at: expect.any(String),
    });
  });

  it('#POST /posts, authenticated users can post a new post to the list', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/callback?code=42').redirects(1);
    const res = await agent.post('/api/v1/posts');
    // console.log('this is the post response.body', res.body);

    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      created_at: expect.any(String),
    });
  });

  // it('#POST /posts, posts are limited to >= 255 characters', async () => {
  //   const agent = request.agent(app);
  //   await agent.get('/api/v1/github/callback?code=42').redirects(1);
  //   const res = await agent.post('/api/v1/posts').send({
  //     content:
  //       'This is the longest post we have and it isnt going to pass the test. This is the longest post we have and it isnt going to pass the test. This is the longest post we have and it isnt going to pass the test. This is the longest post we have and it isnt going to pass the test.',
  //   });

  //   console.log('lengthy response body', res.body);

  //   expect(res.status).toBe(500);

  //   expect(res.body).toEqual({
  //     status: 500,
  //     message: 'your post exceeds our character limit of 255',
  //   });
  // });
});
