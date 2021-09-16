module.exports = (sequelize, Sequelize) => {
    const taskAssignmnetModel = sequelize.define("taskassignmnet", {
        companyId: {
            type: Sequelize.INTEGER
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        },
        //default 1
        isActive: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        assignBy: {
            type: Sequelize.STRING
        },
        //default goal
        eventType: {
            type: Sequelize.DataTypes.ENUM('objective', 'tactics', 'strategy', 'activity', 'goal'),
            defaultValue: 'goal',
        },
        eventId: {
            type: Sequelize.INTEGER
        },

    });
    return taskAssignmnetModel;
};