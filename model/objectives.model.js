module.exports = (sequelize, Sequelize) => {
    const objectiveModel = sequelize.define("objective", {
        goalsId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        endDate: {
            type: Sequelize.DATE
        },
        assignBy: {
            type: Sequelize.INTEGER
        },
        addedBy: {
            type: Sequelize.INTEGER
        }
    });
    return objectiveModel;
};