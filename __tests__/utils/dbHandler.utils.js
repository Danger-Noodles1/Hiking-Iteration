const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoServer = new MongoMemoryServer();

exports.dbConnect = async () => {
  //console.log(`Connecting to MongoMemoryServer`);
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, mongooseOpts);
};

exports.dbDisconnect = async () => {
  //console.log(`Disconnecting from MongoMemoryServer`);
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

// const { dbConnect, dbDisconnect } = require('/dbHandler.utils.js');
