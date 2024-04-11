import mysql from 'mysql2/promise';

const configMysql = {
    host: 'localhost',
    user: 'root',
    password: '070303',
    database: 'mydb',
};

export const CONNECT_MYSQL_DB = async () => {
    const connection = await mysql.createPool(configMysql);
    try {
        const [results, fields] = await connection.query('SELECT * FROM `pay rates`');

        console.log(results); // results contains rows returned by server
        console.log(fields);
    } catch (error) {
        console.log(error);
    }
};
