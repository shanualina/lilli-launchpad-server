module.exports = (sequelize, Sequelize) => {
    const strategyModel = sequelize.define("strategy", {
        goalsId: {
            type: Sequelize.INTEGER
        },
        objectiveId:{
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
    return strategyModel;
};