module.exports = (sequelize, Sequelize) => {
    const projectInfoModel = sequelize.define("projectInfo", {
        companyId: {
            type: Sequelize.INTEGER
        },
        projectId: {
            type: Sequelize.INTEGER
        },
        //default status panding
        status: {
            type: Sequelize.STRING
        },
        activityDetail: {
            type: Sequelize.JSON
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        }
    });
    return projectInfoModel;
};