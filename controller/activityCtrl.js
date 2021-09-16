var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');

//project activity
router.post('/save', async (req, res) => {
    try {
        const activityExits = await db.activityModel.findOne({
            where: {
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
                strategyId: req.body.strategyId,
                tacticsId: req.body.tacticsId,
                name: req.body.name,
            }
        })
        if (!activityExits) {
            const activity = await db.activityModel.create({
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
                strategyId: req.body.strategyId,
                tacticsId: req.body.tacticsId,
                name: req.body.name,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                assignBy: req.body.assignBy,
                addedBy: req.body.addedBy,
            })
            if (!activity) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            return res.send({
                status: 200,
                message: messageConst.activityCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.activityAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update activity
router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const activityUpdate = await db.activityModel.update(req.body,
            { where: { id: id } })
        if (!activityUpdate) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        // const activity = await db.activityLogModel.create({
        //     userId: id,
        //     message: "company information has been updated successfully",
        //     dateTime: Date.now(),
        //     activityOperationType: "update",
        //     activityType: "company",
        //     createdby: id,
        //     updatedby: id
        // })
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

//activity list
router.get('/list', async (req, res) => {
    try {
        const oactivityList = await db.activityModel.findAll({
            order: [['createdAt', 'DESC']],
        })
        if (!oactivityList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: oactivityList
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
        const activityDelete = await db.activityModel.destroy({ where: { id: id } })
        if (!activityDelete) {
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
//get list 
router.get('/list/:goalsId/:objectiveId/:strategyId/:tacticsId', async (req, res) => {
    try {
        const activityList = await db.activityModel.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                goalsId: req.params.goalsId,
                objectiveId: req.params.objectiveId,
                strategyId: req.params.strategyId,
                tacticsId: req.params.tacticsId,
            }
        })
        if (!activityList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: activityList
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
