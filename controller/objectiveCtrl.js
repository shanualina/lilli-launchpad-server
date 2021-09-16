var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');

//project objective
router.post('/save', async (req, res) => {
    try {
        const objectivesExits = await db.objectivesModel.findOne({
            where: {
                goalsId: req.body.goalsId,
                name: req.body.name,
            }
        })
        if (!objectivesExits) {
            const objectives = await db.objectivesModel.create({
                goalsId: req.body.goalsId,
                name: req.body.name,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                assignBy: req.body.assignBy,
                addedBy: req.body.addedBy,
            })
            if (!objectives) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            const activity = await db.activityLogModel.create({
                userId: req.body.addedBy,
                message: "New objective added " + req.body.name,
                dateTime: Date.now(),
                activityOperationType: "insert",
                activityType: "company",
                createdby: req.body.addedBy,
                updatedby: req.body.addedBy
            })
            return res.send({
                status: 200,
                message: messageConst.objectiveCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.objectiveAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update objective
router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const objective = await db.objectivesModel.update(req.body,
            { where: { id: id } })
        if (!objective) {
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

//objective list
router.get('/list', async (req, res) => {
    try {
        const objectivesList = await db.objectivesModel.findAll({
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
        const objectiveDelete = await db.objectivesModel.destroy({ where: { id: id } })
        if (!objectiveDelete) {
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
//get record by goal id
router.get('/list/:goalsId', async (req, res) => {
    try {
        const objectivesList = await db.objectivesModel.findAll({
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

module.exports = router;
