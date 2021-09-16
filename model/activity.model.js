module.exports = (sequelize, Sequelize) => {
    const activityModel = sequelize.define("activity", {
        goalsId: {
            type: Sequelize.INTEGER
        },
        objectiveId: {
            type: Sequelize.INTEGER
        },
        strategyId: {
            type: Sequelize.INTEGER
        },
        tacticsId: {
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
        //no need
        assignBy: {
            type: Sequelize.INTEGER
        },
        addedBy: {
            type: Sequelize.INTEGER
        }
    });
    return activityModel;
};