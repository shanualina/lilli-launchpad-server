var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
const decodeToken = require('../config/decodeTokon').decodeToken
//project goals
router.post('/save', async (req, res) => {
    try {
        const id = decodeToken(req, res);
        const employee = await db.employeeModel.findOne({ where: { id: id } })
        console.log(employee)
        const goalsExits = await db.goalsModel.findOne({
            where: {
                companyId: employee.companyId,
                projectId: req.body.projectId,
                name: req.body.name,
            }
        })
        if (!goalsExits) {
            const goals = await db.goalsModel.create({
                companyId: employee.companyId,
                projectId: req.body.projectId,
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                assignBy: employee.id,
                addedBy: employee.id,
            })
            if (!goals) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            const activity = await db.activityLogModel.create({
                userId: req.body.addedBy,
                message: "New goal added " + req.body.name,
                dateTime: Date.now(),
                activityOperationType: "insert",
                activityType: "company",
                createdby: employee.id,
                updatedby: employee.id
            })
            return res.send({
                status: 200,
                message: messageConst.goalCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.goalAreadyError
        });

    } catch (error) {
        //(error)
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update goals
router.post('/update/:id', async (req, res) => {
    // console.log(req.body)
    try {
        const id = req.params.id;
        const goalsComapy = await db.goalsModel.update(req.body,
            { where: { id: id } })
        if (!goalsComapy) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        // const activity = await activityLogModel.create({
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
        // console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//golas list
router.get('/list', async (req, res) => {
    try {
        const goalList = await db.goalsModel.findAll({
            order: [['createdAt', 'DESC']],
        })
        if (!goalList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: goalList
        });

    } catch (error) {
        //  console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//delete record byn user
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const goalsDelete = await db.goalsModel.destroy({ where: { id: id } })
        if (!goalsDelete) {
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
//get goals by company id and project id
router.get('/goals', async (req, res) => {
    try {
        const id = decodeToken(req, res);
        console.log(id)
        const taskAssignment = await db.taskAssignmentModel.findAll({ where: { userId: id } })
        const results = await Promise.all(taskAssignment.map(async task => {
            task = task.toJSON();
            task.goal = await db.goalsModel.findAll({
                where: { id: task.id, assignBy: task.assignBy },
                attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
            })
            task.objective = await db.objectivesModel.findAll({
                where: { goalsId: task.id, assignBy: task.assignBy },
                attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
            })
            task.strategy = await db.strategyModel.findAll({
                where: { goalsId: task.id, assignBy: task.assignBy },
                attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
            })
            task.tatics = await db.tacticsModel.findAll({
                where: { goalsId: task.id, assignBy: task.assignBy },
                attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
            })
            task.activity = await db.activityModel.findAll({
                where: { goalsId: task.id, assignBy: task.assignBy },
                attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
            })
            return task;
        }))
        if (results.length > 0) {
            return res.status(200).send({
                status: 200,
                data: results
            });
        }
        return res.status(404).send({
            status: 404,
            message: messageConst.listblank
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//
// router.post('/goalList', async (req, res) => {
//     try {

//         //goal record
//         if (req.body.assignBy && req.body.companyId && req.body.projectId) {
//             const goalList = await db.goalsModel.findAll({
//                 order: [['createdAt', 'DESC']],
//                 where: {
//                     assignBy: req.body.assignBy,
//                     projectId: req.body.projectId,
//                     companyId: req.body.companyId
//                 }
//             })
//             const results = await Promise.all(goalList.map(async goal => {
//                 goal = goal.toJSON();
//                 goal.objective = await db.objectivesModel.findAll({
//                     where: { goalsId: goal.id, assignBy: goal.assignBy },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 goal.strategy = await db.strategyModel.findAll({
//                     where: { goalsId: goal.id, assignBy: goal.assignBy },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 goal.tatics = await db.tacticsModel.findAll({
//                     where: { goalsId: goal.id, assignBy: goal.assignBy },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 goal.activity = await db.activityModel.findAll({
//                     where: { goalsId: goal.id, assignBy: goal.assignBy },
//                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                 })
//                 return goal;
//             }))
//             if (results.length > 0) {
//                 return res.status(200).send({
//                     status: 200,
//                     data: results
//                 });
//             }
//             return res.status(404).send({
//                 status: 404,
//                 message: messageConst.listblank
//             });
//         }
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
//             //  console.log(object.length)
//             if (object.length > 0) {
//                 return res.send({
//                     status: 200,
//                     data: object
//                 });
//             }
//             else {
//                 if (object.length == 0) {
//                     const strategyList = await db.strategyModel.findAll({
//                         order: [['createdAt', 'DESC']],
//                         where: {
//                             assignBy: req.body.assignBy,
//                         }
//                     })
//                     const results = await Promise.all(strategyList.map(async strategy => {
//                         strategy = strategy.toJSON();
//                         strategy.tatics = await db.tacticsModel.findAll({
//                             where: { strategyId: strategy.id, assignBy: strategy.assignBy },
//                             attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                         })
//                         strategy.activity = await db.activityModel.findAll({
//                             where: { strategyId: strategy.id, assignBy: strategy.assignBy },
//                             attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                         })
//                         return strategy;
//                     }))
//                     if (results.length > 0) {
//                         return res.status(200).send({
//                             status: 200,
//                             data: results
//                         });
//                     }
//                     else {
//                         if (results.length == 0) {
//                             const tacticsList = await db.tacticsModel.findAll({
//                                 order: [['createdAt', 'DESC']],
//                                 where: {
//                                     assignBy: req.body.assignBy,
//                                 }
//                             })
//                             const tacticss = await Promise.all(tacticsList.map(async tactics => {
//                                 tactics = tactics.toJSON();
//                                 tactics.activity = await db.activityModel.findAll({
//                                     where: { tacticsId: tactics.id, assignBy: tactics.assignBy },
//                                     attributes: ['id', 'name', 'status', 'startDate', 'endDate', 'assignBy', 'addedBy']
//                                 })
//                                 return tactics;
//                             }))
//                             if (tacticss.length > 0) {
//                                 return res.status(200).send({
//                                     status: 200,
//                                     data: tacticss
//                                 });
//                             }
//                             if (tacticss.length == 0) {
//                                 const activityList = await db.activityModel.findAll({
//                                     order: [['createdAt', 'DESC']],
//                                     where: {
//                                         assignBy: req.body.assignBy,
//                                     }
//                                 })
//                                 if (activityList.length > 0) {
//                                     return res.status(200).send({
//                                         status: 200,
//                                         data: activityList
//                                     });
//                                 }
//                                 return res.send({
//                                     status: 404,
//                                     message: messageConst.listblank
//                                 });
//                             }
//                         }
//                         return res.status(404).send({
//                             status: 404,
//                             message: messageConst.listblank,
//                         });
//                     }
//                 } return res.status(404).send({
//                     status: 404,
//                     message: messageConst.listblank,
//                 });
//             }

//         } return res.status(404).send({
//             status: 404,
//             message: messageConst.listblank,
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             status: 500,
//             message: messageConst.unableProcess
//         });
//     }
// })




module.exports = router;
