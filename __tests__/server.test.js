const mongoose = require('mongoose');
const express = require('express');
const supertest = require('supertest');
const { MongoClient } = require('mongodb');

const client = new MongoClient(global.__MONGO_URI__);
const { dbConnect, dbDisconnect } = require('./utils/dbHandler.utils.js');

const User = require('../server/models/User');
const Post = require('../server/models/Post');
const Hike = require('../server/models/Hike');
const userRoute = require('../server/routers/userRouter');
const hikeRoute = require('../server/routers/hikeRouter');
const postRouter = require('../server/routers/postRouter');

// //helper function for temp server instance:
const createServer = () => {
  const app = express();
  app.use(express.json());
  console.log('inside createServer pre routes');
  app.use('/api/users', userRoute);
  app.use('/api/hikes', hikeRoute);
  app.use('/api/posts', postRouter);
  console.log('inside createServer pre return');
  return app;
};

//spin up server instance
const testApp = createServer();

//setup and teardown db connection
beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

//route tests:
describe('Server Test Suite', () => {
  //before testing /getall route, create a temp user record:
  it('successfully gets all users', async () => {
    const user1 = await User.create({
      firstName: 'user1First',
      lastName: ' user1Last',
      location: 'user1ville',
      email: 'user1@user1.com',
      password: 'user1pass',
    });
    const user2 = await User.create({
      firstName: 'user2First',
      lastName: ' user2Last',
      location: 'user2ville',
      email: 'user2@user2.com',
      password: 'user2pass',
    });

    await supertest(testApp)
      .get('/api/users/getall')
      .expect(200)
      .then((response) => {
        //check response type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(2);
        //console.log('in expect statements1');
        //check response data
        expect(response.body[0]._id).toBe(user1.id);
        expect(response.body[0].firstName).toBe(user1.firstName);
        expect(response.body[0].lastName).toBe(user1.lastName);
        expect(response.body[0].location).toBe(user1.location);
        expect(response.body[0].email).toBe(user1.email);
        expect(response.body[0].password).toBe(user1.password);
        expect(response.body[1]._id).toBe(user2.id);
        expect(response.body[1].firstName).toBe(user2.firstName);
        expect(response.body[1].lastName).toBe(user2.lastName);
        expect(response.body[1].location).toBe(user2.location);
        expect(response.body[1].email).toBe(user2.email);
        expect(response.body[1].password).toBe(user2.password);
        //
      });
  });

  it('successfully creates new post', async () => {
    const post = {
      title: 'Post 1',
      content: 'Lorem ipsum',
    };

    await supertest(testApp)
      .post('/api/posts/new')
      .send(post)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body).toBeTruthy();
        expect(response.body.content).toBe(post.content);
        // Check the data in the database
        const savedPost = await Post.findOne({ title: post.title });
        expect(savedPost).toBeTruthy();
        expect(savedPost.content).toBe(post.content);
      });
  });

  test('successfully deletes post', async () => {
    const post = await Post.create({
      title: 'Post 2',
      content: 'Some stuff',
    });

    await supertest(testApp)
      .delete('/api/posts/' + post.id)
      .expect(200)
      .then(async () => {
        expect(await Post.findOne({ _id: post.id })).toBeFalsy();
      });
  });

  it('successfully adds a hike', async () => {
    const hike = {
      title: 'test hike',
      difficulty: 5,
    };
    await supertest(testApp)
      .post('/api/get/hikes')
      .send(hike)
      //.expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body).toBeTruthy();

        // Check the data in the database
        const savedHike = await Hike.find({ title: hike.title });
        expect(savedHike).toBeTruthy();
      });
  });
});
