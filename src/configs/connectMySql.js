// import mysql from 'mysql2/promise';
import mysql from 'mysql';

const configMysql = {
    host: 'localhost',
    user: 'root',
    password: '070303',
    database: 'mydb',
};

let connection;
export const CONNECT_MYSQL_DB = async () => {
    connection = mysql.createConnection(configMysql);
    connection.connect((error) => {
        if (error) {
            console.log('Failed to connect to MySQL database!');
            console.log(error);
            return;
        }
        console.log('Connected to MySQL database!');
    });
};

export const GET_CONNECTION_MYSQL = () => {
    if (!connection) {
        throw new Error('MySQL connection has not been established yet!');
    }
    return connection;
};
