var express = require('express');
var router = express.Router();
var db = require("../model");
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
                return res.status(208).send({
                    status: 208,
                    message: "role already exits!"
                })
            }
            return res.status(200).send({
                status: 200,
                message: "role create sucessfully!"
            })
        }
        return res.status(208).send({
            status: 208,
            message: "role already exits!"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
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
                message: "no record found!"
            })
        }
        return res.status(200).send({
            status: 200,
            data: roleExits
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
        })
    }
})

//update role
router.post('/update/:id', async (req, res, next) => {
    try {
        const roleExits = await roleModel.findOne({ where: { name: req.body.name } })
        if (!roleExits) {
            const role = roleModel.update(req.body, { where: { id: req.params.id } })
            if (!role) {
                return res.status(304).send({
                    status: 304,
                    message: "Not Modified"
                })
            }
            return res.status(200).send({
                status: 200,
                message: "role update sucessfully!"
            })
        }
        return res.status(208).send({
            status: 208,
            message: "role already exits!"
        })

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
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
            message: "unable to process!"
        })
    }
})

module.exports = router;