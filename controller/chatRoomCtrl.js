var express = require('express');
var router = express.Router();
var db = require("../model");
/**
 * post create room 
*/
router.post('/create', async (req, res, next) => {
    console.log(req.body)
    try {
        const room = 'chat' + req.body.userId + req.body.senderId
        const chatroom = await db.chatRoomModel.findOne({ where: { roomId: room } })
        if (!chatroom) {
            const chat = await db.chatRoomModel.create({
                roomId: room,
                userId: req.body.userId,
                senderId: req.body.senderId,
                createdby: req.body.userId,
                updatedby: req.body.userId
            })
            if (!chat) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                })
            }
            return res.status(200).send({
                status: 200,
                data: chat
            })
        }
        return res.status(208).send({
            status: 208,
            data: chatroom.roomId
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

router.get('/', function(req, res, next) {
    res.io.emit("socketToMe", "users");
    res.send('respond with a resource.');
  });
module.exports = router;