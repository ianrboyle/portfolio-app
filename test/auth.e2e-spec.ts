import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const body = { email: 'loll@lol.com', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(body)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(body.email);
      });
  });

  it('handles a signin request', () => {
    const body = { email: 'loll@lol.com', password: 'password' };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(body)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(body.email);
      });
  });
  it('signs up as a new user and then gets currently logged in user', async () => {
    const userBody = { email: 'newUser@lol.com', password: 'password' };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userBody)
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/currentuser')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(userBody.email);
  });
});
