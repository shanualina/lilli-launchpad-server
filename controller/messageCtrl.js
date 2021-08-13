var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
/**
 * post create room 
*/
router.get('/getchat/:roomId', async (req, res, next) => {
    console.log(req.body)
    try {
        const chatroom = await db.messageModel.findAll({ where: { roomId: req.params.roomId } })
        if (!chatroom) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: chatroom
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