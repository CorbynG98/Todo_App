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
    .post('/auth/signin')
    .send({ username: 'test1', password: 'password' })
    .set('Accept', 'application/json');
  sessionToken = response.body.token;
};

/**
 * Tests for the get endpoint
 */
describe('Get Todo', () => {
  it('GET /todo with an authed user should succeed with 0 or more results', async () => {
    // Authenticate first
    const response = await requestWithSupertest
      .get('/todo')
      .set('Authorization', `${sessionToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('GET /todo with an invalid authed user should fail', async () => {
    // Authenticate first
    await requestWithSupertest
      .get('/todo')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('GET /todo with an no user should fail with 401', async () => {
    // Authenticate first
    await requestWithSupertest.get('/todo').expect(401);
  });
});

/**
 * Tests for the create endpoint
 */
describe('Create Todo', () => {
  it('POST /todo with valid data and authed user should succeed', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: 'Test todo 1' })
      .set('Authorization', `${sessionToken}`)
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('POST /todo with invalid data and authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: '' })
      .set('Authorization', `${sessionToken}`)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('POST /todo with valid data and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: 'Test todo 1' })
      .set('Authorization', `totallyRandomToken`)
      .set('Accept', 'application/json')
      .expect(403);
  });

  it('POST /todo with invalid data and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: '' })
      .set('Authorization', `totallyRandomToken`)
      .set('Accept', 'application/json')
      .expect(403);
  });

  it('POST /todo with valid data and no user should fail', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: 'Test todo 2' })
      .set('Accept', 'application/json')
      .expect(401);
  });

  it('POST /todo with invalid data and no user should fail', async () => {
    await requestWithSupertest
      .post('/todo')
      .send({ title: '' })
      .set('Accept', 'application/json')
      .expect(401);
  });
});

/**
 * Tests for the remove endpoint
 */
describe('Remove Todo', () => {
  it('DELETE /todo with valid id and authed user should succeed', async () => {
    await requestWithSupertest
      .delete('/todo/bbe060a5a2c11')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('DELETE /todo with invalid id and authed user should fail', async () => {
    await requestWithSupertest
      .delete('/todo/totallyInvalid')
      .set('Authorization', `${sessionToken}`)
      .expect(404);
  });

  it('DELETE /todo with valid id and invalid authed user should succeed', async () => {
    await requestWithSupertest
      .delete('/todo/bbe060a5a2c11')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('DELETE /todo with invalid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .delete('/todo/totallyInvalid')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('DELETE /todo with valid id and no authed user should fail', async () => {
    await requestWithSupertest.delete('/todo/bbe060a5a2c11').expect(401);
  });

  it('DELETE /todo with invalid id and no authed user should fail', async () => {
    await requestWithSupertest.delete('/todo/totallyInvalid').expect(401);
  });
});

/**
 * Tests for the toggleComplete endpoint
 */
describe('Toggle Todo Complete', () => {
  it('POST /todo/:id/toggleComplete with valid id and authed user should succeed', async () => {
    await requestWithSupertest
      .post('/todo/6dd1b73fe2845/toggleComplete')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('POST /todo:id/toggleComplete with invalid id and authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/totallyInvalid/toggleComplete')
      .set('Authorization', `${sessionToken}`)
      .expect(404);
  });

  it('POST /todo/:id/toggleComplete with valid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/6dd1b73fe2845/toggleComplete')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /todo:id/toggleComplete with invalid id and invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/totallyInvalid/toggleComplete')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /todo:id/toggleComplete with valid id and no authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/6dd1b73fe2845/toggleComplete')
      .expect(401);
  });

  it('POST /todo:id/toggleComplete with invalid id and no authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/totallyInvalid/toggleComplete')
      .expect(401);
  });
});

/**
 * Tests for the clear completed endpoint
 */
describe('Clear Completed', () => {
  it('POST /todo/clearCompleted with authed user should succeed', async () => {
    await requestWithSupertest
      .post('/todo/clearCompleted')
      .set('Authorization', `${sessionToken}`)
      .expect(204);
  });

  it('POST /todo/clearCompleted with invalid authed user should fail', async () => {
    await requestWithSupertest
      .post('/todo/clearCompleted')
      .set('Authorization', `totallyRandomToken`)
      .expect(403);
  });

  it('POST /todo/clearCompleted with no authed user should fail', async () => {
    await requestWithSupertest.post('/todo/clearCompleted').expect(401);
  });
});
