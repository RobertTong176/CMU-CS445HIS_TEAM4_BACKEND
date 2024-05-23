import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import sql from 'mssql/msnodesqlv8.js';
import { GET_CONNECTION_MYSQL } from '~/configs/connectMySql';
import { sendMessageToAdmins } from '~/socket/socketConfig';

const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');
        return {
            data: users || [],
            message: 'Successfully',
        };
    } catch (error) {
        throw error;
    }
};

const blockUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        user.isBlock = true;
        user.save();
        return {
            message: 'Block user successfully',
        };
    } catch (error) {
        throw error;
    }
};

const deleteEmployeeIfExists = async (id) => {
    return new Promise((resolve, reject) => {
        try {
            const connection = GET_CONNECTION_MYSQL();
            const query = 'SELECT 1 FROM `Employee` WHERE idEmployee = ?';
            connection.query(query, [id], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (results.length === 0) {
                    throw new ApiError(StatusCodes.NOT_FOUND, 'Employee not found');
                }
                const deleteQuery = 'DELETE FROM `Employee` WHERE idEmployee = ?';
                connection.query(deleteQuery, [id], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve({ status: StatusCodes.OK, message: 'Employee deleted successfully from MySQL' });
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};
const deleteEmployee = async (id) => {
    try {
        const request = new sql.Request();
        const query = `SELECT 1 FROM Personal WHERE PERSONAL_ID = ${id}`;
        const result = await request.query(query);
        if (result.recordset.length === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Employee not found');
        }

        // Bắt đầu giao dịch SQL Server
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            // Xóa các bản ghi liên quan trong bảng Job_History và Employment_Working_Time
            await transaction
                .request()
                .query(
                    `DELETE FROM Job_History WHERE EMPLOYMENT_ID IN (SELECT EMPLOYMENT_ID FROM Employment WHERE PERSONAL_ID = ${id})`,
                );
            await transaction
                .request()
                .query(
                    `DELETE FROM Employment_Working_Time WHERE EMPLOYMENT_ID IN (SELECT EMPLOYMENT_ID FROM Employment WHERE PERSONAL_ID = ${id})`,
                );

            // Xóa bản ghi trong bảng Employment
            await transaction.request().query(`DELETE FROM Employment WHERE PERSONAL_ID = ${id}`);

            // Xóa bản ghi trong bảng Personal
            await transaction.request().query(`DELETE FROM Personal WHERE PERSONAL_ID = ${id}`);

            // Commit transaction
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        const employeeResult = await deleteEmployeeIfExists(id);
        sendMessageToAdmins(`Employee with ID ${id} has been deleted`);
        return { status: StatusCodes.OK, message: 'Employee deleted successfully' };
    } catch (error) {
        throw error;
    }
};

const addEmployeePayroll = async (employee) => {
    // console.log('check run', employee);
    return new Promise((resolve, reject) => {
        try {
            const connection = GET_CONNECTION_MYSQL();
            const query = `
                    INSERT INTO Employee (
                        idEmployee, \`Employee Number\`, \`Last Name\`, \`First Name\`, SSN, \`Pay Rate\`, 
                        \`Pay Rates_idPay Rates\`, \`Vacation Days\`, \`Paid To Date\`, \`Paid Last Year\`
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
            const values = [
                employee.PERSONAL_ID,
                employee.PERSONAL_ID,
                employee.CURRENT_LAST_NAME,
                employee.CURRENT_FIRST_NAME,
                employee.SNN,
                employee.PAY_RATE,
                employee.PAY_RATE_ID,
                employee.VACATION_DAYS,
                employee.PAID_TO_DATE,
                employee.PAID_LAST_YEAR,
            ];

            connection.query(query, values, (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                    return;
                }
                resolve({ status: 200, message: 'Employee added successfully to MySQL' });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const addBenefitPlan = async (req) => {
    try {
        const { BENEFIT_PLANS_ID, PLAN_NAME, Deductable, Percentage_Copay } = req.body;
        const request = new sql.Request();
        await request
            .input('BENEFIT_PLANS_ID', sql.Numeric, BENEFIT_PLANS_ID)
            .input('PLAN_NAME', sql.NChar(10), PLAN_NAME)
            .input('Deductable', sql.Money, Deductable)
            .input('Percentage_Copay', sql.Numeric, Percentage_Copay)
            .query(
                `INSERT INTO BENEFIT_PLANS (BENEFIT_PLANS_ID, PLAN_NAME, Deductable, Percentage_Copay) VALUES (@BENEFIT_PLANS_ID, @PLAN_NAME, @Deductable, @Percentage_Copay)`,
            );
        return { message: 'Add new benefit plans successfully' };
    } catch (error) {
        throw error;
    }
};

const addNewEmployee = async (req) => {
    try {
        const {
            PERSONAL_ID,
            CURRENT_FIRST_NAME,
            CURRENT_LAST_NAME,
            CURRENT_MIDDLE_NAME,
            BIRTH_DATE,
            SOCIAL_SECURITY_NUMBER,
            DRIVERS_LICENSE,
            CURRENT_ADDRESS_1,
            CURRENT_ADDRESS_2,
            CURRENT_CITY,
            CURRENT_COUNTRY,
            CURRENT_ZIP,
            CURRENT_GENDER,
            CURRENT_PHONE_NUMBER,
            CURRENT_PERSONAL_EMAIL,
            CURRENT_MARITAL_STATUS,
            ETHNICITY,
            SHAREHOLDER_STATUS,
            BENEFIT_PLAN_ID,
        } = req.body;

        try {
            const request = new sql.Request();
            request.input('PERSONAL_ID', sql.Numeric, PERSONAL_ID);
            request.input('CURRENT_FIRST_NAME', sql.NVarChar(50), CURRENT_FIRST_NAME);
            request.input('CURRENT_LAST_NAME', sql.NVarChar(50), CURRENT_LAST_NAME);
            request.input('CURRENT_MIDDLE_NAME', sql.NVarChar(50), CURRENT_MIDDLE_NAME);
            request.input('BIRTH_DATE', sql.Date, BIRTH_DATE);
            request.input('SOCIAL_SECURITY_NUMBER', sql.NVarChar(20), SOCIAL_SECURITY_NUMBER);
            request.input('DRIVERS_LICENSE', sql.NVarChar(50), DRIVERS_LICENSE);
            request.input('CURRENT_ADDRESS_1', sql.NVarChar(255), CURRENT_ADDRESS_1);
            request.input('CURRENT_ADDRESS_2', sql.NVarChar(255), CURRENT_ADDRESS_2);
            request.input('CURRENT_CITY', sql.NVarChar(100), CURRENT_CITY);
            request.input('CURRENT_COUNTRY', sql.NVarChar(100), CURRENT_COUNTRY);
            request.input('CURRENT_ZIP', sql.Numeric, CURRENT_ZIP);
            request.input('CURRENT_GENDER', sql.NVarChar(20), CURRENT_GENDER);
            request.input('CURRENT_PHONE_NUMBER', sql.NVarChar(15), CURRENT_PHONE_NUMBER);
            request.input('CURRENT_PERSONAL_EMAIL', sql.NVarChar(50), CURRENT_PERSONAL_EMAIL);
            request.input('CURRENT_MARITAL_STATUS', sql.NVarChar(50), CURRENT_MARITAL_STATUS);
            request.input('ETHNICITY', sql.NChar(10), ETHNICITY);
            request.input('SHAREHOLDER_STATUS', sql.SmallInt, SHAREHOLDER_STATUS);
            request.input('BENEFIT_PLAN_ID', sql.Numeric, BENEFIT_PLAN_ID);

            const result = await new Promise((resolve, reject) => {
                request.query(
                    `
                        INSERT INTO PERSONAL (
                            PERSONAL_ID,
                            CURRENT_FIRST_NAME,
                            CURRENT_LAST_NAME,
                            CURRENT_MIDDLE_NAME,
                            BIRTH_DATE,
                            SOCIAL_SECURITY_NUMBER,
                            DRIVERS_LICENSE,
                            CURRENT_ADDRESS_1,
                            CURRENT_ADDRESS_2,
                            CURRENT_CITY,
                            CURRENT_COUNTRY,
                            CURRENT_ZIP,
                            CURRENT_GENDER,
                            CURRENT_PHONE_NUMBER,
                            CURRENT_PERSONAL_EMAIL,
                            CURRENT_MARITAL_STATUS,
                            ETHNICITY,
                            SHAREHOLDER_STATUS,
                            BENEFIT_PLAN_ID
                        )
                        VALUES (
                            @PERSONAL_ID,
                            @CURRENT_FIRST_NAME,
                            @CURRENT_LAST_NAME,
                            @CURRENT_MIDDLE_NAME,
                            @BIRTH_DATE,
                            @SOCIAL_SECURITY_NUMBER,
                            @DRIVERS_LICENSE,
                            @CURRENT_ADDRESS_1,
                            @CURRENT_ADDRESS_2,
                            @CURRENT_CITY,
                            @CURRENT_COUNTRY,
                            @CURRENT_ZIP,
                            @CURRENT_GENDER,
                            @CURRENT_PHONE_NUMBER,
                            @CURRENT_PERSONAL_EMAIL,
                            @CURRENT_MARITAL_STATUS,
                            @ETHNICITY,
                            @SHAREHOLDER_STATUS,
                            @BENEFIT_PLAN_ID
                        )
                    `,
                    (err, rowCount) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rowCount);
                        }
                    },
                );
            });
            await addEmployeePayroll(req.body);
            sendMessageToAdmins(
                `Employee with ID : ${PERSONAL_ID} and NAME : ${CURRENT_FIRST_NAME} has just been added`,
            );

            return { message: 'Employee added successfully' };
        } catch (err) {
            throw err;
        }
    } catch (error) {
        throw error;
    }
};

const checkVacationDay = async () => {
    // console.log('check run', employee);
    return new Promise((resolve, reject) => {
        try {
            const ALLOWED_VACATION_DAYS = 20;
            const connection = GET_CONNECTION_MYSQL();
            const query = 'SELECT * FROM Employee WHERE `Vacation Days` > ?';

            connection.query(query, [ALLOWED_VACATION_DAYS], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ data: results, message: 'Check Vacation Day success' });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const adminService = {
    getAllUsers,
    blockUser,
    deleteEmployee,
    addBenefitPlan,
    addNewEmployee,
    checkVacationDay,
};
