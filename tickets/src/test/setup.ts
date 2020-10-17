import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';


declare global {
  namespace NodeJS {
    interface Global {
      getAuthCookie(): string[];
    }
  }  
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'secretKey';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

//Create globally scoped function for signin (getting the auth cookie), it is global for ease of use...
global.getAuthCookie = () => {  
  // Build a JWT payload. {id, email}
  const payload = {
    //use a unique random value for the user id
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }; 
  //Create a JWT
  const token =  jwt.sign(payload, process.env.JWT_KEY!);

  //Build session Object {jwt: MY_JWT}
  const session = { jwt: token };  

  //Turn that string into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string that is the cookie with the encoded data
  return [`express:sess=${base64}`];
}
