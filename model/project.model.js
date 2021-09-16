module.exports = (sequelize, Sequelize) => {
    const projectModel = sequelize.define("project", {
        projectName: {
            type: Sequelize.STRING
        },
        responsivePerson :{
            type: Sequelize.STRING
        },
        companyId: {
            type: Sequelize.INTEGER
        },
        projectPic: {
            type: Sequelize.STRING
        },
        regionId:{
            type: Sequelize.INTEGER
        },
        startDate: {
            type: Sequelize.DATE
        },
        endDate: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.INTEGER
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return projectModel;
};
