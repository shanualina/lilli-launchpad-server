module.exports = (sequelize, Sequelize) => {
    const roleModel = sequelize.define("roles", {
        name: {
            type: Sequelize.STRING
        },
        type:{
            type: Sequelize.STRING
        },
        roleOrder:{
            type: Sequelize.INTEGER
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