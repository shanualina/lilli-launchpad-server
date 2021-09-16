var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var projectInfoModel = db.projectInfoModel;
var sequelize = db.Sequelize;
//create project info 
router.post('/save', async (req, res, next) => {
    try {
        const projectInfo = projectInfoModel.create({
            companyId: req.body.companyId,
            projectId: req.body.projectId,
            status: req.body.status,
            activityDetail: req.body.activityDetail,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        })
        if (!projectInfo) {
            return res.status(204).send({
                status: 204,
                message: messageConst.NoContent
            })
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.projectInfoCreateSuccuss
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//project info list
router.get('/list', async (req, res, next) => {
    try {
        const projectInfo = await projectInfoModel.findAll({})
        if (!projectInfo) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: projectInfo
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//update project info 
router.post('/update/:id', async (req, res, next) => {
    try {
        let updateObject = {};
        if (req.body.companyId) {
            updateObject.companyId = req.body.companyId;
        }
        if (req.body.projectId) {
            updateObject.projectId = req.body.projectId;
        }
        if (req.body.status) {
            updateObject.status = req.body.status;
        }
        if (req.body.activityDetail) {
            updateObject.activityDetail = req.body.activityDetail;
        }
        const projectInfo = projectInfoModel.update(updateObject, { where: { id: req.params.id } })
        if (!projectInfo) {
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

//delete  project info 
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const result = await projectInfoModel.destroy({ where: { id: req.params.id } })
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

//get Single Record by project id
router.get('/getbyid/:projectId', async (req, res, next) => {
    try {
        const projectInfo = await projectInfoModel.findOne({ where: { projectId: req.params.projectId } })
        if (!projectGoal) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: projectInfo
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

router.get('/getbyid/:companyId', async (req, res, next) => {
    try {
        const projectInfo = await projectInfoModel.findOne({ where: { companyId: req.params.companyId } })
        if (!projectGoal) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: projectInfo
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

module.exports = router;