var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');

//project tactic
router.post('/save', async (req, res) => {
    try {
        const tacticsExits = await db.tacticsModel.findOne({
            where: {
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
                strategyId: req.body.strategyId,
                name: req.body.name,
            }
        })
        if (!tacticsExits) {
            const tactics = await db.tacticsModel.create({
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
                strategyId: req.body.strategyId,
                name: req.body.name,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                assignBy: req.body.assignBy,
                addedBy: req.body.addedBy,
            })
            if (!tactics) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            return res.send({
                status: 200,
                message: messageConst.tacticsCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.tacticsAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update tactic
router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const tacticsUpdate = await db.tacticsModel.update(req.body,
            { where: { id: id } })
        if (!tacticsUpdate) {
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

//tactic list
router.get('/list', async (req, res) => {
    try {
        const objectivesList = await db.tacticsModel.findAll({
            order: [['createdAt', 'DESC']],
        })
        if (!objectivesList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: objectivesList
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
        const tacticsDelete = await db.tacticsModel.destroy({ where: { id: id } })
        if (!tacticsDelete) {
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


//tactic list by goalsId  objectiveId strategyId
router.get('/list/:goalsId/:objectiveId/:strategyId', async (req, res) => {
    try {
        const objectivesList = await db.tacticsModel.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                goalsId: req.params.goalsId,
                objectiveId: req.params.objectiveId,
                strategyId: req.params.strategyId,
            }
        })
        if (!objectivesList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: objectivesList
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
