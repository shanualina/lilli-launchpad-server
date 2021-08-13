module.exports = (sequelize, Sequelize) => {
    const roleHashPermissionModel = sequelize.define("role_hash_permission", {
        permissionId: {
            type: Sequelize.INTEGER
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return roleHashPermissionModel;
};