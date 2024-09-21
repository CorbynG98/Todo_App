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

describe('User Signin', () => {
  it('POST /v1/auth/signin with valid data should return 200 with token', async () => {
    const response = await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: 'test1', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('session_token');
  });

  it('POST /v1/auth/signin with valid username and invalid password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: 'test999', password: 'totallyInvalid' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('POST /v1/auth/signin with invalid username and valid password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: 'test999', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('POST /v1/auth/signin with no username should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: '', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('POST /v1/auth/signin with no password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: 'test1', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('POST /v1/auth/signin with no username and no password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signin')
      .send({ username: '', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

describe('User Create', () => {
  it('POST /v1/auth/signup with valid data should return 201 with token', async () => {
    const response = await requestWithSupertest
      .post('/v1/auth/signup')
      .send({ username: 'testCreate', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('session_token');
  });

  it('POST /v1/auth/signup with existing username should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signup')
      .send({ username: 'test1', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('POST /v1/auth/signup with no username should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signup')
      .send({ username: '', password: 'password' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('POST /v1/auth/signup with no password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signup')
      .send({ username: 'test999', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('POST /v1/auth/signup with no username and no password should return 400', async () => {
    await requestWithSupertest
      .post('/v1/auth/signup')
      .send({ username: '', password: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

describe('User Signout', () => {
  it('POST /v1/auth/signout with a valid session should succeed', async () => {
    await requestWithSupertest
      .post('/v1/auth/signout')
      .set('Authorization', `${sessionToken}`)
      .set('Accept', 'application/json')
      .expect(204);
  });

  it('POST /v1/auth/signout with an invalid session should fail', async () => {
    await requestWithSupertest
      .post('/v1/auth/signout')
      .set('Accept', 'application/json')
      .set('Authorization', `superInvalidToken`)
      .expect('Content-Type', /json/)
      .expect(403);
  });

  it('POST /v1/auth/signout with no token should return 401', async () => {
    await requestWithSupertest
      .post('/v1/auth/signout')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });
});
