import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { CONNECT_MONGO_DB } from '~/configs/connectMongoDb.js';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { APIs_V1 } from '~/routes/v1';
import { CONNECT_SQL_DB } from '~/configs/connectSqlDb';
import { CONNECT_MYSQL_DB } from '~/configs/connectMySql';
import http from 'http';
import { setupSocketIo } from '~/socket/socketConfig';
dotenv.config();

const app = express();

const START_SERVER = () => {
    const port = process.env.PORT || 8085;

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    //setup socket io
    const server = http.createServer(app);
    setupSocketIo(server);

    app.use('/v1', APIs_V1);

    //Error handling middleware concentrate
    app.use(errorHandlingMiddleware);

    server.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
};

//connect mongo alias
CONNECT_MONGO_DB()
    .then(() => {
        console.log('Connected to database mongoDB!');
    })
    .then(() => {
        (async () => await CONNECT_MYSQL_DB())();
        CONNECT_SQL_DB();
        START_SERVER();
    })
    .catch((error) => {
        console.error(error);
        process.exit();
    });
