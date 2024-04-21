import express from 'express';
// import exitHook from 'exit-hook';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { CONNECT_MONGO_DB } from '~/configs/connectMongoDb.js';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { APIs_V1 } from '~/routes/v1';
import { CONNECT_SQL_DB } from '~/configs/connectSqlDb';
import { CONNECT_MYSQL_DB } from '~/configs/connectMySql';
// import { CONNECT_MYSQL_DB } from '~/configs/connectMySql';
dotenv.config();

const app = express();
const START_SERVER = () => {
    const port = process.env.PORT || 8000;

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/v1', APIs_V1);

    //Error handling middleware concentrate
    app.use(errorHandlingMiddleware);

    app.listen(port, () => {
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

// (async () => await CONNECT_MYSQL_DB())();

// const pool = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '070303',
//     database: 'mydb',
//     // host: 'localhost',
//     // user: 'root',
//     // database: 'mydb',
// });
// const connection =  pool.getConnection();
// try {
//     const [results, fields] = connection.query('SELECT * FROM `pay rates`');

//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//     console.log(err);
// }

// const configMysql = {
//     user: 'root',
//     password: '070303',
//     database: 'PR',
// };

// const connection = await mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '070303',
//     database: 'payrollDB',
// });


