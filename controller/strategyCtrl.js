var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');

//project objective
router.post('/save', async (req, res) => {
    try {
        const strategyExits = await db.strategyModel.findOne({
            where: {
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
                name: req.body.name,
            }
        })
        if (!strategyExits) {
            const objectives = await db.strategyModel.create({
                goalsId: req.body.goalsId,
                objectiveId: req.body.objectiveId,
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
            return res.send({
                status: 200,
                message: messageConst.strategyCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.strategyAreadyError
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
        const objective = await db.strategyModel.update(req.body,
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
        const objectivesList = await db.strategyModel.findAll({
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
        const objectiveDelete = await db.strategyModel.destroy({ where: { id: id } })
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

router.get('/list/:goalsId/:objectiveId', async (req, res) => {
    try {
        const objectivesList = await db.strategyModel.findAll({
            order: [['createdAt', 'DESC']],
            where: {
                goalsId: req.params.goalsId,
                objectiveId: req.params.objectiveId,
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

// router.post('/goalList', async (req, res) => {
//     try {



//         //ob objective based reocrd
//         if (req.body.assignBy) {
//             const objectives = await db.objectivesModel.findAll({
//                 order: [['createdAt', 'DESC']],
//                 where: {
//                     assignBy: req.body.assignBy,
//                 }
//             })
//             const object = await Promise.all(objectives.map(async objective => {
//                 objective = objective.toJSON();
//                 objective.strategy = await db.strategyModel.findAll({
//                     where: { assignBy: objective.assignBy, objectiveId: objective.id },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 objective.tatics = await db.tacticsModel.findAll({
//                     where: { assignBy: objective.assignBy, objectiveId: objective.id },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 objective.activity = await db.activityModel.findAll({
//                     where: { assignBy: objective.assignBy, objectiveId: objective.id },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 return objective;
//             }))
//             if (object.length > 0) {
//                 return res.status(200).send({
//                     status: 200,
//                     data: object
//                 });
//             }
//             return res.status(404).send({
//                 status: 404,
//                 data: messageConst.listblank
//             });
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             status: 500,
//             message: messageConst.unableProcess
//         });
//     }
// })
module.exports = router;
