import sql from 'mssql/msnodesqlv8.js';

const configSql = {
    server: 'DESKTOP-VIS0R2A\\SQLEXPRESS',
    database: 'HRM',
    options: {
        trustedConnection: true,
    },
    driver: 'msnodesqlv8',
};

export const CONNECT_SQL_DB = () => {
    sql.connect(configSql, function (err) {
        if (err) console.log(err);
        else {
            console.log('Connected to Sql Server');
        }
    });
};
