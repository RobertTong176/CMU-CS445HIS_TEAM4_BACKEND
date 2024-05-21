import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import sql from 'mssql/msnodesqlv8.js';
import { GET_CONNECTION_MYSQL } from '~/configs/connectMySql';

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
const deleteHumanAndPayroll = async (id) => {
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

        return { status: StatusCodes.OK, message: 'Employee deleted successfully' };
    } catch (error) {
        throw error;
    }
};

export const adminService = {
    getAllUsers,
    blockUser,
    deleteHumanAndPayroll,
};
