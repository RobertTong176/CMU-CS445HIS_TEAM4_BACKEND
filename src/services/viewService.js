import sql from 'mssql/msnodesqlv8.js';
import { GET_CONNECTION_MYSQL } from '~/configs/connectMySql';

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

const filterEmployeeHuman = async (queryStr) => {
    try {
        const { gender, ethnicity, partTime, fullTime, shareholder } = queryStr;
        const request = new sql.Request();
        const query = `SELECT 
    P.*,
    E.EMPLOYMENT_CODE,
    E.EMPLOYMENT_STATUS,
    E.HIRE_DATE_FOR_WORKING,
    E.WORKERS_COMP_CODE,
    E.TERMINATION_DATE,
    E.REHIRE_DATE_FOR_WORKING,
    E.LAST_REVIEW_DATE,
    B.PLAN_NAME,
    J.DEPARTMENT,
    J.DIVISION,
    J.FROM_DATE AS JOB_FROM_DATE,
    J.THRU_DATE AS JOB_THRU_DATE,
    J.JOB_TITLE,
    J.SUPERVISOR,
    J.LOCATION,
    WT.YEAR_WORKING,
    WT.MONTH_WORKING
FROM 
    PERSONAL P
LEFT JOIN 
    EMPLOYMENT E ON P.PERSONAL_ID = E.EMPLOYMENT_ID
LEFT JOIN 
    JOB_HISTORY J ON E.EMPLOYMENT_ID = J.EMPLOYMENT_ID
LEFT JOIN 
    EMPLOYMENT_WORKING_TIME WT ON E.EMPLOYMENT_ID = WT.EMPLOYMENT_ID
LEFT JOIN 
    BENEFIT_PLANS B ON P.PERSONAL_ID = B.BENEFIT_PLANS_ID;`;

        const response = await request.query(query);
        let filteredEmployees = response?.recordsets[0].filter((employee) => {
            if (gender && employee.CURRENT_GENDER !== gender) return false;
            if (ethnicity && employee.ETHNICITY !== ethnicity) return false;
            if (partTime && employee.EMPLOYMENT_STATUS !== 'Nam') return false;
            if (fullTime && employee.EMPLOYMENT_STATUS !== 'Nữ') return false;
            if (shareholder && employee.SHAREHOLDER_STATUS !== +shareholder) return false;

            return true;
        });
        return filteredEmployees || [];
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
        console.log(response);
        return response?.recordsets[0] || [];
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
};
