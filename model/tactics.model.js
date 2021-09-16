module.exports = (sequelize, Sequelize) => {
    const tacticsModel = sequelize.define("tactics", {
        goalsId: {
            type: Sequelize.INTEGER
        },
        objectiveId:{
            type: Sequelize.INTEGER
        },
        strategyId:{
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
    return tacticsModel;
};