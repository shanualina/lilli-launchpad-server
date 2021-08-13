var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var roleModel = db.roleModel;

//create role 
router.post('/save', async (req, res, next) => {
    try {
        const roleExits = await roleModel.findOne({ where: { name: req.body.name } })
        if (!roleExits) {
            const role = roleModel.create({
                name: req.body.name,
                type: req.body.type,
                status: req.body.status,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
            })
            if (!role) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                })
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.roleCreateSuccuss
            })
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.roleAlreadyExist
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
router.get('/rolelist', async (req, res, next) => {
    try {
        const roleExits = await roleModel.findAll({ where: { status: 1 } })
        if (!roleExits) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: roleExits
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
        if (!req.body.name) {
            const role = roleModel.update(req.body, { where: { id: req.params.id } })
            if (!role) {
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
        else {
            const roleExits = await roleModel.findOne({ where: { name: req.body.name } })
            if (!roleExits) {
                const role = roleModel.update(req.body, { where: { id: req.params.id } })
                if (!role) {
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
                message: messageConst.roleAlreadyExist
            })
        }


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//delete role
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const result = await roleModel.destroy({ where: { id: req.params.id } })
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
router.get('/get/:id', async (req, res, next) => {
    try {
        const roleExits = await roleModel.findOne({ where: { id: req.params.id } })
        if (!roleExits) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            })
        }
        return res.status(200).send({
            status: 200,
            data: roleExits
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

module.exports = router;