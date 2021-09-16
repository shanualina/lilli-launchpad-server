module.exports = (sequelize, Sequelize) => {
    const projectGoalModel = sequelize.define("projectgoals", {
        goalsName: {
            type: Sequelize.STRING
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        }

    });
    return projectGoalModel;
};