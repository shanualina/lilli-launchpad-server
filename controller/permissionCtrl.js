var express = require('express');
var router = express.Router();
var db = require("../model");
var permissionModel = db.permissionModel;
//create permission 
router.post('/save', async (req, res, next) => {
    try {
        const permission = permissionModel.create({
            name: req.body.name,
            actionUrl: req.body.actionUrl,
            permissionAction: req.body.permissionAction,
            status: req.body.status,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        })
        if (!permission) {
            return res.status(400).send({
                status: 400,
                message: "Bad Request!"
            })
        }
        return res.status(200).send({
            status: 200,
            message: "permission create sucessfully!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
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
                message: "no record found!"
            })
        }
        return res.status(200).send({
            status: 200,
            data: permission
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unbale to process!"
        })
    }
})

// //update permission
router.post('/update/:id', async (req, res, next) => {
    try {
        const role = permissionModel.update(req.body, { where: { id: req.params.id } })
        if (!role) {
            return res.status(304).send({
                status: 304,
                message: "Not Modified"
            })
        }
        return res.status(200).send({
            status: 200,
            message: "pemission update sucessfully!"
        })
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unbale to process!"
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
                message: "id not found!"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "delete successful!"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: "unbale to process!"
        })
    }
})

module.exports = router;