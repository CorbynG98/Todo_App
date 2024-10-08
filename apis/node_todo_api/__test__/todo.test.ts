import supertest from 'supertest';
import { createPool } from '../src/config/db';
import server from '../src/config/express';

const requestWithSupertest = supertest(server);

// Safety fallback check for test ENV
if (process.env.NODE_ENV !== 'test') {
  throw new Error('ENVIRONMENT NOT SET TO TEST. FAILING WITH ERROR.');
}

beforeAll(async () => {
  await createPool();
  await authenticateUser();
});

var sessionToken: string = '';
const authenticateUser = async () => {
  const response = await requestWithSupertest
    .post('/v1/auth/signin')
    .send({ username: 'test1', password: 'password' })
    .set('Accept', 'application/json');
  sessionToken = response.body.session_token;
};

/**
 * Tests for the get endpoint
 */
describe('Get Todo', () => {
  it('GET /v1/todo with an authed user should succeed with 0 or more results', async () => {
    // Authenticate first
    const response = await requestWithSupertest
      .get('/v1/todo')
      .set('Authorization', `${sessionToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /v1/todo with an invalid authed user should fail', async () => {
    // Authenticate first
    await requestWithSupertest
      .get('/v1/todo')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('GET /v1/todo with an no user should fail with 401', async () => {
    // Authenticate first
    await requestWithSupertest.get('/v1/todo').expect(401);
  });
});

/**
 * Tests for the create endpoint
 */
describe('Create Todo', () => {
  it('POST /v1/todo with valid data and authed user should succeed', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: 'Test todo 1' })
      .set('Authorization', `${sessionToken}`)
      .set('Accept', 'application/json')
      .expect(200);
  });

  it('POST /v1/todo with invalid data and authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: '' })
      .set('Authorization', `${sessionToken}`)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('POST /v1/todo with valid data and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: 'Test todo 1' })
      .set('Authorization', `totallyRandomToken`)
      .set('Accept', 'application/json')
      .expect(403);
  });

  it('POST /v1/todo with invalid data and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: '' })
      .set('Authorization', `totallyRandomToken`)
      .set('Accept', 'application/json')
      .expect(403);
  });

  it('POST /v1/todo with valid data and no user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: 'Test todo 2' })
      .set('Accept', 'application/json')
      .expect(401);
  });

  it('POST /v1/todo with invalid data and no user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo')
      .send({ title: '' })
      .set('Accept', 'application/json')
      .expect(401);
  });
});

/**
 * Tests for the remove endpoint
 */
describe('Remove Todo', () => {
  it('DELETE /v1/todo with valid id and authed user should succeed', async () => {
    await requestWithSupertest
      .delete('/v1/todo/bbe060a5a2c11')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('DELETE /v1/todo with invalid id and authed user should fail', async () => {
    await requestWithSupertest
      .delete('/v1/todo/totallyInvalid')
      .set('Authorization', `${sessionToken}`)
      .expect(404);
  });

  it('DELETE /v1/todo with valid id and invalid authed user should succeed', async () => {
    await requestWithSupertest
      .delete('/v1/todo/bbe060a5a2c11')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('DELETE /v1/todo with invalid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .delete('/v1/todo/totallyInvalid')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('DELETE /v1/todo with valid id and no authed user should fail', async () => {
    await requestWithSupertest.delete('/v1/todo/bbe060a5a2c11').expect(401);
  });

  it('DELETE /v1/todo with invalid id and no authed user should fail', async () => {
    await requestWithSupertest.delete('/v1/todo/totallyInvalid').expect(401);
  });
});

/**
 * Tests for the toggleComplete endpoint
 */
describe('Toggle Todo Complete', () => {
  it('POST /v1/todo/:id/toggleComplete with valid id and authed user should succeed', async () => {
    await requestWithSupertest
      .post('/v1/todo/6dd1b73fe2845/toggleComplete')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('POST /v1/todo:id/toggleComplete with invalid id and authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/totallyInvalid/toggleComplete')
      .set('Authorization', `${sessionToken}`)
      .expect(404);
  });

  it('POST /v1/todo/:id/toggleComplete with valid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/6dd1b73fe2845/toggleComplete')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /v1/todo:id/toggleComplete with invalid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/totallyInvalid/toggleComplete')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /v1/todo:id/toggleComplete with valid id and no authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/6dd1b73fe2845/toggleComplete')
      .expect(401);
  });

  it('POST /v1/todo:id/toggleComplete with invalid id and no authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/totallyInvalid/toggleComplete')
      .expect(401);
  });
});

/**
 * Tests for the clear completed endpoint
 */
describe('Clear Completed', () => {
  it('POST /v1/todo/clearCompleted with authed user should succeed', async () => {
    await requestWithSupertest
      .post('/v1/todo/clearCompleted')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('POST /v1/todo/clearCompleted with invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/v1/todo/clearCompleted')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /v1/todo/clearCompleted with no authed user should fail', async () => {
    await requestWithSupertest.post('/v1/todo/clearCompleted').expect(401);
  });
});
