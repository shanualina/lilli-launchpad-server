module.exports = (sequelize, Sequelize) => {
    const companyModel = sequelize.define("company", {
        name: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        mobileNumber: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.DATE
        },
        planId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return companyModel;
};