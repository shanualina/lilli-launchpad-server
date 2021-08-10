
module.exports = (sequelize, Sequelize) => {
    const superAdminModel = sequelize.define("superAdmin", {
        firstName: {
            type: Sequelize.STRING
        },
        lastName:{
            type: Sequelize.STRING
        },
        userName:{
            type: Sequelize.STRING
        },
        email:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        },
        mobileNo:{
            type: Sequelize.STRING
        },
        profilePic:{
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        }
    });
    return superAdminModel;
};