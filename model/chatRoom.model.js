module.exports = (sequelize, Sequelize) => {
    const chatRoom = sequelize.define("chatroom", {
        roomId: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.INTEGER
        },
        senderId: {
            type: Sequelize.INTEGER
        },
        createdby: {
            type: Sequelize.STRING
        },
        updatedby: {
            type: Sequelize.STRING
        },
    });
    return chatRoom;
};