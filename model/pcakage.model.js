module.exports = (sequelize, Sequelize) => {
    const messagesModel = sequelize.define("package", {
        name: {
            type: Sequelize.STRING
        },
        priceUnit: {
            type: Sequelize.STRING
        },
        feature: {
            type: Sequelize.STRING
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return messagesModel;
};