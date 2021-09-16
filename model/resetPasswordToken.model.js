
module.exports = (sequelize, Sequelize) => {
    const employeeModel = sequelize.define("restepasswordtoken", {
        token: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        updatedBy: {
            type: Sequelize.INTEGER
        }
    });
    return employeeModel;
};