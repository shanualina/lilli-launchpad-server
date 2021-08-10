module.exports = (sequelize, Sequelize) => {
    const roleModel = sequelize.define("roles", {
        name: {
            type: Sequelize.STRING
        },
        type:{
            type: Sequelize.STRING
        },
        status:{
            type: Sequelize.STRING
        },
        createdby:{
            type: Sequelize.STRING
        },
        updatedby:{
            type: Sequelize.STRING
        },
     
    });
    return roleModel;
};