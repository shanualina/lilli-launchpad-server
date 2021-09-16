module.exports = (sequelize, Sequelize) => {
    const activityLog = sequelize.define("activityLog", {
        userId: {
            type: Sequelize.INTEGER
        },
        message : {
            type: Sequelize.STRING
        },
        dateTime: {
            type: Sequelize.DATE
        },
        //create ,update,delete
        activityOperationType:{
            type: Sequelize.STRING
        },
        //user employee
        activityType:{
            type: Sequelize.STRING
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        }
    });
    return activityLog;
};