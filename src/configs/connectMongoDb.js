import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

let memoDatabaseInstance = null;

const mongoClientInstance = new MongoClient(
    'mongodb+srv://lamtruong070303:zlouKtTRKfAuTMWx@cluster0.gipiicd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        // serverApi: {
        //     version: ServerApiVersion.v1,
        //     strict: true,
        //     deprecationErrors: true,
        // },
    },
);

export const connectMongoDb = () => {
    mongoose
        .connect(process.env.MONGODB_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        .then((data) => {
            console.log(`Mongoose connected with server ${data.connection.host}`);
        })
        .catch((error) => {
            console.log(error);
        });
};

export const CONNECT_MONGO_DB = async () => {
    await mongoClientInstance.connect();
    memoDatabaseInstance = mongoClientInstance.db(process.env.MONGODB_NAME);
};

export const GET_MONGO_DB = () => {
    if (!memoDatabaseInstance) throw new Error('Must connect to Database first!');
    return memoDatabaseInstance;
};
