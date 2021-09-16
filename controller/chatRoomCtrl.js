var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
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
/**
 * get room detail using userId
*/
router.post('/getroom', async (req, res, next) => {
    try {
        const chatroom = await db.chatRoomModel.findOne({ where: { userId: req.body.userId } })
        if (!chatroom) {
            const admin = await db.superAdminModel.findOne({
                limit: 1,
                order: [['createdAt', 'DESC']]
            })
            console.log(admin)
            const room = 'chat' + req.body.userId + admin.id
            const chat = await db.chatRoomModel.create({
                roomId: room,
                userId: req.body.userId,
                senderId: admin.id,
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

//create chat room
router.post('/createroom', async (req, res, next) => {
    try {
        const room = 'empcompnay' + req.body.companyId + req.body.employeeId
        const chatroom = await db.employeeCompanyChatModel.findOne({ where: { roomId: room } })
        if (!chatroom) {
            const chat = await db.employeeCompanyChatModel.create({
                roomId: room,
                companyId: req.body.companyId,
                employeeId: req.body.employeeId,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
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
module.exports = router;