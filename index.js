import express from 'express';
import sql from 'mssql/msnodesqlv8.js';
import mysql from 'mysql2/promise';
// import exitHook from 'exit-hook';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GET_MONGO_DB, CONNECT_MONGO_DB } from '~/configs/connectMongoDb.js';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { APIs_V1 } from '~/routes/v1';
import { CONNECT_MYSQL_DB } from '~/configs/connectMySql';
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
    .then(() => START_SERVER())
    .catch((error) => {
        console.error(error);
        process.exit();
    });

(async () => await CONNECT_MYSQL_DB())();

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

// const configSql = {
//     server: 'DESKTOP-VIS0R2A\\SQLEXPRESS',
//     database: 'HR',
//     options: {
//         trustedConnection: true,
//     },
//     driver: 'msnodesqlv8',
// };

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

// sql.connect(configSql, function (err) {
//     if (err) console.log(err);

//     var request = new sql.Request();
//     console.log('Running query');

//     var query = 'select * from Benefit_Plans';
//     request.query(query, function (err, records) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(records); //
//         }
//     });
// });
