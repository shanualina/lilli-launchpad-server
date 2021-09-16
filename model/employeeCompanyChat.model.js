module.exports = (sequelize, Sequelize) => {
    const employeeCompanyRoomChat = sequelize.define("employeecompanyroomchat", {
        roomId: {
            type: Sequelize.STRING
        },
        companyId: {
            type: Sequelize.INTEGER
        },
        employeeId: {
            type: Sequelize.INTEGER
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return employeeCompanyRoomChat;
};