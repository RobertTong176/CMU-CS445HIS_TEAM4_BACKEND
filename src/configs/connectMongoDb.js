import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import 'dotenv/config';

let memoDatabaseInstance = null;

export const CONNECT_MONGO_DB = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URL, {});
    memoDatabaseInstance = connect;
};

export const GET_MONGO_DB = () => {
    if (!memoDatabaseInstance) throw new Error('Must connect to Database first!');
    return memoDatabaseInstance;
};

// const mongoClientInstance = new MongoClient(process.env.MONGODB_URL, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });

// export const CONNECT_MONGO_DB = async () => {
//     await mongoClientInstance.connect();
//     memoDatabaseInstance = mongoClientInstance.db(process.env.MONGODB_NAME);
// };

// export const GET_MONGO_DB = () => {
//     if (!memoDatabaseInstance) throw new Error('Must connect to Database first!');
//     return memoDatabaseInstance;
// };

// export const CLOSE_MONGO_DB = async () => {
//     await mongoClientInstance.close();
// };
