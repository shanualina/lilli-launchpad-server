module.exports = (sequelize, Sequelize) => {
    const companyTransactionModel = sequelize.define("companyTransaction", {
        companyId: {
            type: Sequelize.INTEGER
        },
        packageId: {
            type: Sequelize.INTEGER
        },
        transactionAmount: {
            type: Sequelize.DECIMAL(25, 2)
        },
        orderId: {
            type: Sequelize.STRING
        },
        paymentId: {
            type: Sequelize.STRING
        },
        paymentResponse: {
            type: Sequelize.STRING
        },
        noOfUser:{
            type: Sequelize.INTEGER
        },
        noOfProject:{
            type: Sequelize.INTEGER
        },
        transactionDetail:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        createdby: {
            type: Sequelize.INTEGER
        },
        updatedby: {
            type: Sequelize.INTEGER
        }
    });
    return companyTransactionModel;
};