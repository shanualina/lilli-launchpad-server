var express = require('express');
var router = express.Router();
var db = require("../model");
var Op = db.sequelize.Op;
const messageConst = require('../config/constMessage');

//craete task 
router.post('/save', async (req, res) => {
    try {
        let task;
        const taskAssignmentExits = await db.taskAssignmentModel.findOne({
            where: {
                projectId: req.body.projectId,
                userId: req.body.userId,
                eventId: req.body.eventId,
            }
        })
        if (!taskAssignmentExits) {
            const taskAssignment = await db.taskAssignmentModel.create({
                companyId: req.body.companyId,
                projectId: req.body.projectId,
                userId: req.body.userId,
                isActive: req.body.isActive,
                assignBy: req.body.assignBy,
                eventType: req.body.eventType,
                eventId: req.body.eventId,
            })
            if (!taskAssignment) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            const employee = await db.employeeModel.findOne({ where: { id: req.body.userId } })
            if (req.body.eventType == "goal") {
                task = await db.goalsModel.findOne({ where: { id: req.body.eventId } })
            }
            if (req.body.eventType == "objective") {
                task = await db.objectivesModel.findOne({ where: { id: req.body.eventId } })
            }
            if (req.body.eventType == "tactics") {
                task = await db.tacticsModel.findOne({ where: { id: req.body.eventId } })
            }
            if (req.body.eventType == "strategy") {
                task = await db.strategyModel.findOne({ where: { id: req.body.eventId } })
            }
            if (req.body.eventType == "activity") {
                task = await db.activityModel.findOne({ where: { id: req.body.eventId } })
            }
            const activity = await db.activityLogModel.create({
                userId: req.body.userId,
                message: "Dear employee " + employee.firstName + " " + employee.lastName + " you have been assigned a new task Name " + task.name,
                dateTime: Date.now(),
                activityOperationType: "assignment",
                activityType: "employee",
                createdby: req.body.assignBy,
                updatedby: req.body.assignBy
            })
            return res.send({
                status: 200,
                message: messageConst.taskAssigmentCreateSuccess
            });

        }
        return res.status(208).send({
            status: 208,
            message: messageConst.taskAssigmentAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//update task
router.post('/update/:id', async (req, res) => {
    try {
        let task;
        let messages;
        const id = req.params.id;
        const taskAssignmentUpdate = await db.taskAssignmentModel.update(req.body,
            { where: { id: id } })
        if (!taskAssignmentUpdate) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        if (req.body.eventType == "goal") {
            task = await db.goalsModel.findOne({ where: { id: req.body.eventId } })
        }
        if (req.body.eventType == "objective") {
            task = await db.objectivesModel.findOne({ where: { id: req.body.eventId } })
        }
        if (req.body.eventType == "tactics") {
            task = await db.tacticsModel.findOne({ where: { id: req.body.eventId } })
        }
        if (req.body.eventType == "strategy") {
            task = await db.strategyModel.findOne({ where: { id: req.body.eventId } })
        }
        if (req.body.eventType == "activity") {
            task = await db.activityModel.findOne({ where: { id: req.body.eventId } })
        }
        if (req.body.isActive == 0) {
            messages = task.name + " Task completed"
        }
        if (req.body.isActive == 2) {
            messages = task.name + " Task in progress"
        }
        if (req.body.isActive == 3) {
            messages = task.name + " Task panding"
        }
        const activity = await db.activityLogModel.create({
            userId: id,
            message: messages,
            dateTime: Date.now(),
            activityOperationType: "update",
            activityType: "employee",
            updatedby: id
        })
        return res.send({
            status: 200,
            message: messageConst.updateSuccuss
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

// task list
router.get('/list/:userId', async (req, res) => {
    try {
        const searchFilter = {}
        if (req.body.status) {
            searchFilter.status = req.body.status
        }
        if (req.body.startDate) {
            searchFilter.startDate = req.body.startDate
        }
        if (req.body.startDate) {
            searchFilter.endDate = req.body.endDate
        }
        if (req.body.startDate && req.body.endDate) {
            searchFilter.startDate = [{ "endDate": { [Op.between]: [req.body.startDate, req.body.endDate] } }]
        }
        const include = [{
            model: db.employeeModel,
            required: false,
            attributes: ['firstName', 'lastName', 'profilePic']
        },]
        const taskAssignmentList = await db.taskAssignmentModel.findAll({
            where: { userId: req.params.userId },
            include: include,
            attributes: ["id", "companyId", "projectId", "userId", "isActive", "assignBy", "eventType", "eventId"],
            order: [['createdAt', 'DESC']],
        })
        const results = await Promise.all(taskAssignmentList.map(async task => {
            task = task.toJSON();
            if (task.eventId) {
                searchFilter.id = task.eventId
            }
            if (task.eventType == "goal") {
                task.goal = await db.goalsModel.findAll({ where: { id: searchFilter } });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "objective") {
                task.objective = await db.objectivesModel.findAll({ where: { id: searchFilter } });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "tactics") {
                task.tactics = await db.tacticsModel.findAll({ where: { id: searchFilter } });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "strategy") {
                task.strategy = await db.strategyModel.findAll({ where: { id: searchFilter } });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "activity") {
                task.activity = await db.activityModel.findAll({ where: { id: searchFilter } });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            return task;
        }))
        if (!results) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: results
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//all record 
router.get('/getall', async (req, res) => {
    try {
        const searchFilter = {}
        const userFilter = {}
        if (req.body.userId) {
            userFilter.userId = req.body.userId
        }
        if (req.body.projectId) {
            userFilter.projectId = req.body.projectId
        }
        if (req.body.companyId) {
            userFilter.companyId = req.body.companyId
        }
        if (req.body.isActive) {
            userFilter.isActive = req.body.isActive
        }
        if (req.body.status) {
            searchFilter.status = req.body.status
        }
        if (req.body.startDate) {
            searchFilter.startDate = req.body.startDate
        }
        if (req.body.startDate) {
            searchFilter.endDate = req.body.endDate
        }
        if (req.body.startDate && req.body.endDate) {
            searchFilter.startDate = [{ "endDate": { [Op.between]: [req.body.startDate, req.body.endDate] } }]
        }
        const include = [{
            model: db.employeeModel,
            required: false,
            attributes: ['firstName', 'lastName', 'profilePic']
        }]
        //with include 
        //search filter date wise is active status wise
        const taskAssignmentList = await db.taskAssignmentModel.findAll({
            where: userFilter,
            include: include,
            attributes: ["id", "companyId", "projectId", "userId", "isActive", "assignBy", "eventType", "eventId"],
            order: [['createdAt', 'DESC']],
        })
        const results = await Promise.all(taskAssignmentList.map(async task => {
            task = task.toJSON();
            if (task.eventId) {
                searchFilter.id = task.eventId
            }
            if (task.eventType == "goal") {
                task.goal = await db.goalsModel.findAll({ where: searchFilter });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "objective") {
                task.objective = await db.objectivesModel.findAll({ where: searchFilter });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "tactics") {
                task.tactics = await db.tacticsModel.findAll({ where: searchFilter });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "strategy") {
                task.strategy = await db.strategyModel.findAll({ where: searchFilter });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            if (task.eventType == "activity") {
                task.activity = await db.activityModel.findAll({ where: searchFilter });
                task.comment = await db.commentModel.findAll({
                    where: { taskId: task.id }
                });
            }
            return task;
        }))
        if (!results) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: results
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//delete record by id
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const taskAssignmentDelete = await db.taskAssignmentModel.destroy({ where: { id: id } })
        if (!taskAssignmentDelete) {
            return res.json({
                status: 404,
                message: messageConst.deleteError
            });
        }
        return res.send({
            status: 200,
            message: messageConst.deleteSucess
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})



module.exports = router;
