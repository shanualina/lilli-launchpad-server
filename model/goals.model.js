
// id name satatus startadte enddate  assignby addedby
module.exports = (sequelize, Sequelize) => {
    const goalsModel = sequelize.define("goals", {
        companyId: {
            type: Sequelize.INTEGER
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        //default status panding
        name: {
            type: Sequelize.STRING
        },
        description:{
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
    return goalsModel;
};