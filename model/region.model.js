module.exports = (sequelize, Sequelize) => {
    const regionModel = sequelize.define("region", {
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.INTEGER
        }
    });
    return regionModel;
};