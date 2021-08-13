var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var permissionModel = db.permissionModel;
var sequelize = db.Sequelize;
//create permission 
router.post('/save', async (req, res, next) => {

    try {
        req.body.permissionAction.forEach(element => {
            const permission = permissionModel.create({
                name: req.body.name,
                actionUrl: req.body.actionUrl,
                permissionAction: element,
                status: req.body.status,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
            })
            if (!permission) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                })
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.permissionCreateSuccuss
            })
        });


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//permission list
router.get('/list', async (req, res, next) => {
    try {
        const permission = await permissionModel.findAll({})
        if (!permission) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: permission
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

// //update permission
router.post('/update/:id', async (req, res, next) => {
    try {
        const role = permissionModel.update({
            name: req.body.name,
            actionUrl: req.body.actionUrl,
            permissionAction: JSON.stringify(req.body.permissionAction),
            status: req.body.status,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        }, { where: { id: req.params.id } })
        if (!role) {
            return res.status(304).send({
                status: 304,
                message: messageConst.notModified
            })
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.permissionUpdateSuccuss
        })
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

// //delete 
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const result = await permissionModel.destroy({ where: { id: req.params.id } })
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
router.get('/getbyid/:id', async (req, res, next) => {
    try {
        const permission = await permissionModel.findOne({ where: { id: req.params.id } })
        if (!permission) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: permission
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})


router.get('/groupbylist', async (req, res, next) => {
    try {
        const permission1 = await permissionModel.findAll({
            attributes: [
                'name',
                [sequelize.fn('GROUP_CONCAT', sequelize.col('permissionAction')), 'permissionAction']
            ],
            group: ['name'],
            order: [
                // Will escape title and validate ASC against a list of valid direction parameters
                ['permissionAction', 'ASC'],]
        })
        if (!permission1) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: permission1,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
module.exports = router;