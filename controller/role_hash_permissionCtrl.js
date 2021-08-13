var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var roleHashPermissionModel = db.roleHashPermissionModel;
//create role 
router.post('/save', async (req, res, next) => {
    try {
        const roleHashPermissionExits = await roleHashPermissionModel.findOne({
            where: {
                permissionId: req.body.permissionId,
                roleId: req.body.roleId
            }
        })
        if (!roleHashPermissionExits) {
            const roleHashPermission = roleHashPermissionModel.create({
                permissionId: req.body.permissionId,
                roleId: req.body.roleId,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
            })
            if (!roleHashPermission) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                })
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.roleHashPermissionSucess
            })
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.roleHashPermissionExits
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//role list
router.get('/list', async (req, res, next) => {
    try {
        const include = [{
            model: db.roleModel,
            required: false,
        }, {
            model: db.permissionModel,
            required: false,
        }
        ]
        const roleHashPermissionExits = await roleHashPermissionModel.findAll({
            include: include,
        })
        if (!roleHashPermissionExits) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: roleHashPermissionExits
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//update role
router.post('/update/:id', async (req, res, next) => {
    try {
        const roleHashPermissionExits = await roleHashPermissionModel.findOne({
            where: {
                permissionId: req.body.permissionId,
                roleId: req.body.roleId
            }
        })
        if (!roleHashPermissionExits) {
            const roleHashPermission = roleHashPermissionModel.update(req.body, { where: { id: req.params.id } })
            if (!roleHashPermission) {
                return res.status(304).send({
                    status: 304,
                    message: messageConst.notModified
                })
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.updateSuccuss
            })
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.roleHashPermissionExits
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//delete role
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const result = await roleHashPermissionModel.destroy({ where: { id: req.params.id } })
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

module.exports = router;