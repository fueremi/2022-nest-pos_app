import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { SignInDTO } from 'src/auth/dto';

describe('E2E Pos App', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const signInPayload: SignInDTO = {
      username: 'fueremi',
      password: 't6!XpL0@@2sk',
    };
    describe('Sign In', () => {
      it('Should Throw Error If Email Empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ password: signInPayload.password })
          .expectStatus(400);
      });
      it('Should Throw Error If Password Empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({ username: signInPayload.username })
          .expectStatus(400);
      });
      it('Should Throw Error If Email & Password Empty', () => {
        return pactum.spec().post('/auth/sign-in').expectStatus(400);
      });
      it('Should Throw Error If Username Not Exists', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({
            username: 'wrongUsername',
            password: signInPayload.password,
          })
          .expectStatus(403);
      });
      it('Should Throw Error If Password Not Match', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody({
            username: signInPayload.username,
            password: 'wrongPassword',
          })
          .expectStatus(403);
      });
      it('Should Sign In', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(signInPayload)
          .expectStatus(200);
      });
    });
  });
});
