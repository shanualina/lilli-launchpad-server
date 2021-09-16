var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
const decodeToken = require('../config/decodeTokon').decodeToken
/**
 * create comment task  
*/
router.post('/save', async (req, res, next) => {
    const id = decodeToken(req, res);
    console.log(req.body)
    try {
        let task;
        console.log(Date.now())
        const employee = await db.employeeModel.findOne({ where: { id: id } })
        const comment = await db.commentModel.create({
            userId: employee.id,
            message: req.body.message,
            isActive: req.body.isActive,
            companyId: employee.companyId,
            projectId: req.body.projectId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
        if (!comment) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }

        // const findTask = await db.taskAssignmentModel.findOne({ where: { id: req.body.taskId } })
        // console.log(findTask)
        // if (findTask.eventType == 'goal') {
        //     task = await db.goalsModel.findOne({ where: { id: findTask.eventId } })
        // }
        // if (findTask.eventType == 'objective') {
        //     task = await db.objectivesModel.findOne({ where: { id: findTask.eventId } })
        // }
        // if (findTask.eventType == 'tactics') {
        //     task = await db.tacticsModel.findOne({ where: { id: findTask.eventId } })
        // }
        // if (findTask.eventType == 'strategy') {
        //     task = await db.strategyModel.findOne({ where: { id: findTask.eventId } })
        // }
        // if (findTask.eventType == 'activity') {
        //     task = await db.activityLogModel.findOne({ where: { id: findTask.eventId } })
        // }

        const activity = await db.activityLogModel.create({
            userId: req.body.userId,
            message: employee.name + " has been comment ",
            dateTime: Date.now(),
            activityOperationType: "comment",
            activityType: "employee",
            createdby: req.body.assignBy,
            updatedby: req.body.assignBy
        })
        return res.status(200).send({
            status: 200,
            message: messageConst.commentCreateSuccess
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})


router.get('/list/:projectId', async (req, res) => {
    try {

        const commentList = await db.commentModel.findAll({
            order: [['id', 'Desc']],
            where: {
                projectId: req.params.projectId
            }
        })

        const object = await Promise.all(commentList.map(async comment => {
            comment = comment.toJSON();
            comment.user = await db.employeeModel.findAll({
                where: {
                    id: comment.userId
                }, attributes: ['name']
            })
            return comment
        }))
        if (!object) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: object
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