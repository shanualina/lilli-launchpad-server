
module.exports = (sequelize, Sequelize) => {
    const employeeModel = sequelize.define("employee", {
        name: {
            type: Sequelize.STRING
        },
        userName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        mobileNo: {
            type: Sequelize.STRING
        },
        
        profilePic: {
            type: Sequelize.STRING
        },
        roleId: {
            type: Sequelize.INTEGER
        },
        companyId: {
            type: Sequelize.INTEGER
        },
        regionId:{
            type: Sequelize.INTEGER
        },
        employeeCode:{
            type: Sequelize.STRING
        },
        dob:{
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.INTEGER
        },
        createdBy:{
            type: Sequelize.INTEGER
        },
        updatedBy:{
            type: Sequelize.INTEGER
        }
    });
    return employeeModel;
};