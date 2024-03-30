import express from 'express';
import sql from 'mssql/msnodesqlv8.js';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectMongoDb } from './src/configs/connectMongoDb.js';
const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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

connectMongoDb();
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// try {
//   const [results, fields] = await connection.query("SELECT * FROM `pay rates`");

//   console.log(results); // results contains rows returned by server
//   console.log(fields); // fields contains extra meta data about results, if available
// } catch (err) {
//   console.log(err);
// }
