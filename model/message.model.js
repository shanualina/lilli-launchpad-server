module.exports = (sequelize, Sequelize) => {
    const messagesModel = sequelize.define("messages", {
        sender: {
            type: Sequelize.STRING
        },
        receiver: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        },
        roomId: {
            type: Sequelize.STRING
        }
    });
    return messagesModel;
};