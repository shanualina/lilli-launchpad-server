var express = require('express');
var router = express.Router();
var db = require("../model");
const multer = require('multer');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
const messageConst = require('../config/constMessage');
var packageModel = db.packageModel;
const JwtAuth = require('../midddlewars/JwtAuth');

//create package
var uploadImage = multer(imagesUpload).single('image');
router.post('/save', uploadImage, JwtAuth.verifyToken, async (req, res) => {
    try {
        const packageExits = await packageModel.findOne({ where: { packageName: req.body.packageName } })
        if (!packageExits) {
            const package = await packageModel.create({
                packageName: req.body.packageName,
                packagePic: 'images/' + req.file.filename,
                projectCount: req.body.projectCount,
                perProjectPrice: req.body.perProjectPrice,
                projectTotalPrice: req.body.projectTotalPrice,
                userCount: req.body.userCount,
                perUserPrice: req.body.perUserPrice,
                userMonthlyPrice: req.body.userMonthlyPrice,
                userYearlyPrice: req.body.userYearlyPrice,
                totalPrice: req.body.totalPrice,
                basicFeature: req.body.basicFeature,
                advanceFeature: req.body.advanceFeature,
                packageDuration: req.body.packageDuration,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
            })
            if (!package) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.packageSuccuss
            });


        }
        return res.status(208).send({
            status: 208,
            message: messageConst.packageExist
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//delete Package
router.delete('/delete/:id', JwtAuth.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const deletepcakage = await packageModel.destroy({ where: { id: id } })
        if (!deletepcakage) {
            return res.status(404).send({
                status: 404,
                message: messageConst.deleteError
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.deleteSucess
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//update package
router.post('/update/:id', uploadImage, JwtAuth.verifyToken, async (req, res) => {
    console.log(req.body)
    try {
        const id = req.params.id;
        let updateObject = {};
        if (req.body.packageName) {
            updateObject.packageName = req.body.packageName;
        }
        if (req.file.filename) {
            updateObject.packagePic = 'images/' + req.file.filename;
        }
        if (req.body.projectCount) {
            updateObject.projectCount = req.body.projectCount;
        }
        if (req.body.userCount) {
            updateObject.userCount = req.body.userCount;
        }
        if (req.body.perProjectPrice) {
            updateObject.perProjectPrice = req.body.perProjectPrice;
        }
        if (req.body.projectTotalPrice) {
            updateObject.projectTotalPrice = req.body.projectTotalPrice;
        }
        if (req.body.perUserPrice) {
            updateObject.perUserPrice = req.body.perUserPrice;
        }
        if (req.body.userMonthlyPrice) {
            updateObject.userMonthlyPrice = req.body.userMonthlyPrice;
        }
        if (req.body.userYearlyPrice) {
            updateObject.userYearlyPrice = req.body.userYearlyPrice;
        }
        if (req.body.basicFeature) {
            updateObject.basicFeature = req.body.basicFeature;
        }
        if (req.body.advanceFeature) {
            updateObject.advanceFeature = req.body.advanceFeature;
        }
        if (req.body.totalPrice) {
            updateObject.totalPrice = req.body.totalPrice;
        }
        if (req.body.packageDuration) {
            updateObject.packageDuration = req.body.packageDuration;
        }
        const deletepcakage = await packageModel.update(updateObject,
            { where: { id: id } })
        if (!deletepcakage) {
            return res.status(304).send({
                status: 304,
                message: messageConst.notModified
            });
        }
        return res.status(200).send({
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

//package list
router.get('/list', async (req, res) => {
    try {

        const packageList = await packageModel.findAll({})

        const results = await Promise.all(packageList.map(async posts => {
            posts = posts.toJSON();
            posts.packagePic = 'http://' + req.headers.host + "/" + posts.packagePic
            return posts;
        }))
        if (!results) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: results
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
router.get('/getpackage/:id', JwtAuth.verifyToken, async (req, res) => {
    try {
        const package = await packageModel.findOne({
            where: {
                id: req.params.id
            }
        })

        const data = {
            packageName: package.packageName,
            packagePic: package.packagePic,
            projectCount: package.projectCount,
            perProjectPrice: package.perProjectPrice,
            projectTotalPrice: package.projectTotalPrice,
            userCount: package.userCount,
            perUserPrice: package.perUserPrice,
            userMonthlyPrice: package.userMonthlyPrice,
            userYearlyPrice: package.userYearlyPrice,
            basicFeature: package.basicFeature,
            totalPrice: package.totalPrice,
            advanceFeature: package.advanceFeature,
            createdby: package.createdby,
            updatedby: package.updatedby,
            packagepics: 'http://' + req.headers.host + "/" + package.packagePic
        }
        if (!package) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: data
        });

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//top 3 selling package
router.get('/toppackage', async (req, res) => {
    try {
        const packageList = await db.companyTransactionModel.findAll({
            limit: 3,
            include: [{
                model: db.packageModel,
                as: 'package',
                duplicating: false,
                required: false
            }],
            group: ['packageId'],
        })
        if (!packageList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: packageList
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


module.exports = router;
