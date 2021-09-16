module.exports = (sequelize, Sequelize) => {
    const commentsModel = sequelize.define("comments", {
        message: {
            type: Sequelize.TEXT
        },
        isActive: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        userId: {
            type: Sequelize.INTEGER
        },
        taskId: {
            type: Sequelize.INTEGER
        },
        companyId : {
            type: Sequelize.INTEGER
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        eventid: {
            type: Sequelize.INTEGER
        },
        parantId:{
            type: Sequelize.INTEGER
        }
    });
    return commentsModel;
};
