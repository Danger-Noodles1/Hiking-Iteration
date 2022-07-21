// const server = require('../server/server');
// const {MongoClient} = require('mongodb');
const fs = require('fs');
const path = require('path');
const User = require('../server/models/User');
const Post = require('../server/models/Post');
const Hike = require('../server/models/Hike');
const { dbConnect, dbDisconnect } = require('./utils/dbHandler.utils.js');
const {
  validateNotEmpty,
  validateMongoDuplicationError,
} = require('./utils/validators.utils');

const fakeUser = {
  firstName: 'Test',
  lastName: 'Dummy',
  location: 'New York',
  email: 'abc@gmail.com',
  password: 'abc123',
};

const fakeHike = {
  user_id: 'fakeuserid123',
  title: 'test walk',
  difficulty: 4,
  type: 'took a test walk',
  distance: 2,
};

const fakeHikeBad = {
  user_id: 'fakeuserid123',
  difficulty: 4,
  type: 'took a test walk',
  distance: 2,
};

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('User Model Test Suite', () => {
  it('should include all fields when adding new users', async () => {
    const validUser = new User(fakeUser);
    const savedUser = await validUser.save();

    // console.log('savedUser',savedUser);
    // console.log('validUser', validUser)
    validateNotEmpty(savedUser.firstName);
    validateNotEmpty(savedUser.lastName);
    validateNotEmpty(savedUser.location);
    validateNotEmpty(savedUser.email);
    validateNotEmpty(savedUser.password);
  });

  it('should not allow two users to have the same email', async () => {
    //expect.assertions(1);
    const user1 = await new User(fakeUser).save();
    // console.log(user1);

    try {
      const user2 = await new User(fakeUser).save();
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });
});

describe('Hike Model Test Suite', () => {
  it('Should include all required fields when adding new hikes', async () => {
    const validHike = new Hike(fakeHike);
    const savedHike = await validHike.save();

    // console.log('savedHike',savedHike);
    // console.log('validHike', validHike)
    validateNotEmpty(savedHike.user_id);
    validateNotEmpty(savedHike.title);
    validateNotEmpty(savedHike.difficulty);
    validateNotEmpty(savedHike.type);
    validateNotEmpty(savedHike.distance);
  });

  it('Should not accept hike with no title', async () => {
    expect.assertions(1);
    try {
      const hikeBad = await new User(fakeHikeBad).save();
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });
});
