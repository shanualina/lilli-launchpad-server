module.exports = (sequelize, Sequelize) => {
    const packageModel = sequelize.define("package", {
        packageName: {
            type: Sequelize.STRING
        },
        packagePic: {
            type: Sequelize.STRING
        },
        projectCount: {
            type: Sequelize.INTEGER
        },
        userCount: {
            type: Sequelize.INTEGER
        },
        perProjectPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        projectTotalPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        perUserPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        userMonthlyPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        userYearlyPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        totalPrice: {
            type: Sequelize.DECIMAL(25, 2)
        },
        packageDuration: {
            type: Sequelize.INTEGER
        },
        basicFeature: {
            type: Sequelize.JSON
        },
        advanceFeature: {
            type: Sequelize.JSON
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return packageModel;
};