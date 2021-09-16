var express = require('express');
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
const messageConst = require('../config/constMessage');
var activityLogModel = db.activityLogModel;
//activity list
router.get('/list', async (req, res) => {
    try {
        const activityLogList = await activityLogModel.findAll({})
        if (!activityLogList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: activityLogList
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//get activity list by user
router.get('/list/:userId', async (req, res) => {
    try {
        const activityLogList = await activityLogModel.findAll({
            where: { userId: userId }
        })
        if (!activityLogList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: activityLogList
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
module.exports = router;
