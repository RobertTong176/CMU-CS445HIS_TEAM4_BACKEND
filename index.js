import express from 'express';
import sql from 'mssql/msnodesqlv8.js';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GET_MONGO_DB, CONNECT_MONGO_DB } from '~/configs/connectMongoDb.js';
dotenv.config();
const app = express();
const START_SERVER = () => {
    const port = process.env.PORT || 8000;

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', async (req, res) => {
        console.log(await GET_MONGO_DB().listCollections().toArray());
        res.send('Hello World!');
    });
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
};

CONNECT_MONGO_DB()
    .then(() => {
        console.log('Connected to database!');
    })
    .then(() => START_SERVER())
    .catch((error) => {
        console.error(error);
        process.exit();
    });

// try {
//   const [results, fields] = await connection.query("SELECT * FROM `pay rates`");

//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
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
