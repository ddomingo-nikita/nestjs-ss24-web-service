import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from "supertest"
import { INestApplication } from '@nestjs/common';
import {AppModule} from "./app.module";

describe('AppController', () => {
  let appController: AppController;

  let app: INestApplication;

  const testData = {
    "avatarName": "Mark",
    "childAge": 12,
    "skinColor": "#0000ff",
    "hairstyle": "short-curly",
    "headShape": "oval",
    "upperClothing": "jacket",
    "lowerClothing": "shorts"
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
        .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Avatar API', () => {
    test("Create avatar", async () => {
      const response = await request(app.getHttpServer())
          .post('/api/avatars')
          .send(testData)
          .set('Accept', 'application/json')
          .expect(201)
      console.log(response.body)
      expect(response.body).toMatchObject(testData)
      // expect(response.body.id).toBeGreaterThan(0)
      expect(response.body.createdAt).toBeDefined()

      const response2 = await request(app.getHttpServer())
          .get(`/api/avatars/${response.body.id}`)
          .set('Accept', 'application/json')
          .expect(200)
    })

    test("Get all avatars", async () => {
      const prevArray = await request(app.getHttpServer()).get('/api/avatars').expect(200)

      const response = await request(app.getHttpServer())
          .post('/api/avatars')
          .send(testData)
          .set('Accept', 'application/json')
          .expect(201)

      const newArray = await request(app.getHttpServer()).get('/api/avatars').expect(200)

      expect(newArray.body.length).toBeGreaterThan(prevArray.body.length)
      expect(newArray.body).toEqual(expect.arrayContaining([expect.objectContaining({id: response.body.id})]))
    })
    test("Update avatar", async () => {
      const updateFields = {
        "avatarName": "Mark",
        "childAge": 14,
        "skinColor": "#ffd",
        "hairstyle": "short-curly",
        "headShape": "oval",
        "upperClothing": "jacket",
        "lowerClothing": "shorts"
      }

      const newAvatar = await request(app.getHttpServer())
          .post('/api/avatars')
          .send(testData)
          .set('Accept', 'application/json')
          .expect(201)

      const updating = await request(app.getHttpServer())
          .put(`/api/avatars/${newAvatar.body.id}`)
          .send(updateFields)
          .set('Accept', 'application/json').expect(204)

      const changedAvatar = await request(app.getHttpServer())
          .get(`/api/avatars/${newAvatar.body.id}`)
          .set('Accept', 'application/json')
          .expect(200)

      expect({...newAvatar.body, ...updateFields}).toMatchObject(changedAvatar.body)
    })

    test("Deleting avatar", async () => {
      const prevArray = await request(app.getHttpServer()).get('/api/avatars').expect(200)

      const response = await request(app.getHttpServer())
          .post('/api/avatars')
          .send(testData)
          .set('Accept', 'application/json')
          .expect(201)

      const deleting = await request(app.getHttpServer())
          .delete(`/api/avatars/${response.body.id}`)
          .expect(204)

      const newArray = await request(app.getHttpServer()).get('/api/avatars').expect(200)

      expect(newArray.body.length).toEqual(prevArray.body.length)
    })
  });




});
