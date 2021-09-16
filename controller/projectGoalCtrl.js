var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var projectGoalModel = db.projectGoalModel;
var sequelize = db.Sequelize;
const JwtAuth = require('../midddlewars/JwtAuth');
//create project goal 
router.post('/save', async (req, res, next) => {
    try {
        const projectGoal = projectGoalModel.create({
            goalsName: req.body.goalsName,
            projectId: req.body.projectId,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        })
        if (!projectGoal) {
            return res.status(204).send({
                status: 204,
                message: messageConst.NoContent
            })
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.projectGoalCreateSuccuss
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//project goal list
router.get('/list', async (req, res, next) => {
    try {
        const projectGoal = await projectGoalModel.findAll({})
        if (!projectGoal) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: projectGoal
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//update project goal 
router.post('/update/:id', async (req, res, next) => {
    try {
        const projectGoal = projectGoalModel.update({
            goalsName: req.body.goalsName,
            projectId: req.body.projectId,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        }, { where: { id: req.params.id } })
        if (!projectGoal) {
            return res.status(304).send({
                status: 304,
                message: messageConst.notModified
            })
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.updateSuccuss
        })
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//delete  project goal 
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const result = await projectGoalModel.destroy({ where: { id: req.params.id } })
        if (!result) {
            return res.status(404).json({
                status: 404,
                message: messageConst.deleteError
            });
        }
        return res.status(200).json({
            status: 200,
            message: messageConst.deleteSucess
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//get Single Record
router.get('/getbyid/:projectId', async (req, res, next) => {
    try {
        const projectGoal = await projectGoalModel.findOne({ where: { projectId: req.params.projectId } })
        if (!projectGoal) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: projectGoal
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

  

module.exports = router;