var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');

//region create
router.post('/save', async (req, res) => {
    try {
        const regionExits = await db.regionModel.findOne({
            where: {
                name: req.body.name,
            }
        })
        if (!regionExits) {
            const region = await db.regionModel.create({
                name: req.body.name,
                status: req.body.status,
            })
            if (!region) {
                return res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            return res.send({
                status: 200,
                message: messageConst.regionCreateSuccess
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.regionAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update activity
router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const regionExits = await db.regionModel.findOne({
            where: {
                name: req.body.name,
            }
        })
        if (!regionExits) {
            const regionUpdate = await db.regionModel.update(req.body,
                { where: { id: id } })
            if (!regionUpdate) {
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
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.regionAreadyError
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//activity list
router.get('/list', async (req, res) => {
    try {
        const regionList = await db.regionModel.findAll({
            order: [['createdAt', 'DESC']],
        })
        if (!regionList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: regionList
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
        const regionDelete = await db.regionModel.destroy({ where: { id: id } })
        if (!regionDelete) {
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
//get list 
router.get('/getbyid/:id', async (req, res) => {
    try {
        const regionList = await db.regionModel.findOne({
            order: [['createdAt', 'DESC']],
            where: {
                id: req.params.id,
            }
        })
        if (!regionList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: regionList
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

module.exports = router;
