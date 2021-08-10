module.exports = (sequelize, Sequelize) => {
    const permissionModel = sequelize.define("permission", {
        name: {
            type: Sequelize.STRING
        },
        actionUrl: {
            type: Sequelize.STRING
        },
        permissionAction: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },

    });
    return permissionModel;
};