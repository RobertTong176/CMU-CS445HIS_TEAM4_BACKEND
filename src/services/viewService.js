import sql from 'mssql/msnodesqlv8.js';
import { GET_CONNECTION_MYSQL } from '~/configs/connectMySql';
import { getAllDataMySqlDb } from '~/db/mySqlDb';
import { getAllDataSqlDb } from '~/db/sqlDb';
import { countFields, mergedArray } from '~/utils/algorithms';

const getAllPersonal = async () => {
    try {
        const request = new sql.Request();
        const query = 'select * from PERSONAL';
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllEmployment = async () => {
    try {
        const request = new sql.Request();
        const query = 'select * from EMPLOYMENT';
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllBenefitPlan = async () => {
    try {
        const request = new sql.Request();
        const query = 'select * from BENEFIT_PLANS';
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllJobHistory = async () => {
    try {
        const request = new sql.Request();
        const query = 'select * from JOB_HISTORY';
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllEmploymentWorkingTime = async () => {
    try {
        const request = new sql.Request();
        const query = 'select * from EMPLOYMENT_WORKING_TIME';
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllPayRates = async () => {
    return new Promise((resolve, reject) => {
        try {
            const connection = GET_CONNECTION_MYSQL();
            const query = 'SELECT * FROM mydb.`pay rates`';
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

const getAllEmployeePayroll = async () => {
    return new Promise((resolve, reject) => {
        try {
            const connection = GET_CONNECTION_MYSQL();
            const query = 'SELECT * FROM mydb.`employee`';
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

const filterEmployeeHuman = async (filters) => {
    try {
        if (filters['SHAREHOLDER_STATUS']) {
            filters['SHAREHOLDER_STATUS'] = +filters['SHAREHOLDER_STATUS'];
        }
        const humanData = await getAllDataSqlDb();
        const payrollData = await getAllDataMySqlDb();
        const filterData = mergedArray(humanData?.recordsets[0], payrollData);

        let filteredEmployees = filterData.filter((item) => {
            let match = true;
            for (let key in filters) {
                if (filters.hasOwnProperty(key)) {
                    if (filters[key] === 'All') {
                        break;
                    }
                    if (item[key] !== filters[key]) {
                        match = false;
                        break;
                    }
                }
            }
            return match;
        });

        let viewData = [];
        let totalEarningCurrentYear = 0;
        let totalEarningLastYear = 0;
        let totalVacationDay = 0;

        if (filteredEmployees.length > 0) {
            filteredEmployees.map((item) => {
                let total = item.Value - item['Tax Percentage'] + item['Pay Amount'];
                const earningCurrentYear = total * item['Paid To Date'];
                const earningLastYear = total * item['Paid Last Year'];
                totalVacationDay += item['Vacation Days'];
                totalEarningCurrentYear += earningCurrentYear;
                totalEarningLastYear += earningLastYear;
                viewData.push({ ...item, earningCurrentYear, earningLastYear });
            });
        }

        return { viewData, totalEarningCurrentYear, totalEarningLastYear, totalVacationDay };
    } catch (error) {
        throw error;
    }
};

const getAllEmployeeBirthday = async (data) => {
    const { month } = data;
    const request = new sql.Request();
    try {
        const currentMonth = month || new Date().getMonth() + 1;
        const query = `
        SELECT *
        FROM PERSONAL
        WHERE MONTH(BIRTH_DATE) = ${currentMonth} 
    `;
        const response = await request.query(query);
        return response?.recordsets[0] || [];
    } catch (error) {
        throw error;
    }
};

const getAllDepartment = async () => {
    try {
        const humanData = await getAllDataSqlDb();
        const payrollData = await getAllDataMySqlDb();
        const allData = mergedArray(humanData?.recordsets[0], payrollData);

        const results = countFields(allData);
        return results;
    } catch (error) {
        throw error;
    }
};

export const viewService = {
    getAllPersonal,
    getAllEmployment,
    getAllBenefitPlan,
    getAllJobHistory,
    getAllEmploymentWorkingTime,
    getAllPayRates,
    getAllEmployeePayroll,
    filterEmployeeHuman,
    getAllEmployeeBirthday,
    getAllDepartment,
};
