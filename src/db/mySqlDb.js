import { GET_CONNECTION_MYSQL } from '~/configs/connectMySql';

const getAllDataMySqlDb = async () => {
    return new Promise((resolve, reject) => {
        const query =
            'SELECT e.idEmployee, e.`Employee Number`,e.`Last Name`, e.`First Name`,e.SSN,e.`Pay Rate`,pr.`Pay Rate Name`,pr.Value,pr.`Tax Percentage`,pr.`Pay Type`,pr.`Pay Amount`,pr.`PT - Level C`,e.`Vacation Days`,e.`Paid To Date`,e.`Paid Last Year`FROM mydb.employee e INNER JOIN mydb.`pay rates` pr ON e.`Pay Rates_idPay Rates` = pr.`idPay Rates`;';
        try {
            const connection = GET_CONNECTION_MYSQL();

            connection.query(query, function (error, results, fields) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        } catch (error) {
            reject(error);
        }
    });
};

export { getAllDataMySqlDb };
