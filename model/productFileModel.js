module.exports = (sequelize, Sequelize) => {
    const productFileModel = sequelize.define("productFile", {
        projectId: {
            type: Sequelize.STRING
        },
        file: {
            type: Sequelize.STRING
        },
        companyId: {
            type: Sequelize.STRING
        }
    });
    return productFileModel;
};