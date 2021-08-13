
var db1 = require('../model');
var io = {};
const { joinUser, removeUser, findUser } = require('./Rooms');
module.exports = (server) => {
    io = require('socket.io')(server)
    io.on("connection", function (socket) {
        try {
            socket.on("join room", async (data) => {
                console.log(data)
                let newUser = joinUser(socket.id, data.userName, data.roomName);
                io.emit("connected", newUser.roomName)

                thisRoom = newUser.roomName;
                try {
                    socket.join(newUser.roomName);
                }
                catch (error) {
                    console.log(error)
                }
            })
        }
        catch (err) {
            console.log(err)
        }
        socket.on("sendMessage", async (data) => {
            await db1.messageModel.create({
                roomId: data.roomName,
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
            })
            io.emit("RecieveMessage", data);
        });
        socket.on("chatclose", async (data) => {
            socket.broadcast.emit('chatend', data);
        });

        socket.on("typing", (user) => {
            console.log("typing");
            io.to(thisRoom).emit("typing", { userName: user });
        });

        //new update
        socket.on("stoptyping", (user) => {
            io.to(thisRoom).emit("stoptyping", { userName: user });
        });
        socket.on("disconnect", () => {
            const user = removeUser(socket.id);
            console.log(user,'hello');
            if (user) {
                console.log(user.userName + ' has left');
            }
            console.log("disconnected");
        });


    })

}