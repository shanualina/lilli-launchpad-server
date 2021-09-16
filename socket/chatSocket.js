
var db1 = require('../model');
var io = {};
var thisRoom = ''
const { joinUser, removeUser, findUser } = require('./Rooms');
module.exports = (server) => {
    io = require('socket.io')(server)
    io.on("connection", function (socket) {

        try {
            socket.on("join room", async (data) => {
                //console.log(data, 'socket')
                let newUser = joinUser(socket.id, data.userName, data.roomName);
                io.emit("connected", newUser.roomName)
               // console.log(newUser)
                thisRoom = newUser.roomName;
               // console.log(thisRoom, 'room')
                try {
                    socket.join(newUser.roomName);
                }
                catch (error) {
                  //  console.log(error)
                }
            })
        }
        catch (err) {
          //  console.log(err);
        }
        socket.on("sendMessage", async (data) => {
            await db1.messageModel.create({
                roomId: data.roomName,
                sender: data.sender,
                message: data.message,
            })
            var date = new Date()
            const chatObj = {
                roomId: data.roomName,
                sender: data.sender,
                message: data.message,
                date: date
            }
            io.to(thisRoom).emit("sendMessage", chatObj);
        });
        socket.on("typing", (user) => {
           // console.log("typing");
            io.to(thisRoom).emit("typing", { userName: user });
        });
        //new update
        socket.on("stoptyping", (user) => {
            io.to(thisRoom).emit("stoptyping", { userName: user });
        });
        socket.on("disconnect", () => {
            const user = removeUser(socket.id);
           // console.log(user, 'hello');
            if (user) {
                console.log(user.userName + ' has left');
            }
           // console.log("disconnected");
        });
    })

}