var express = require('express');
var router = express.Router();
var db = require("../model");
var jwt = require("jsonwebtoken");
const multer = require('multer');
const JwtAuth = require('../midddlewars/JwtAuth');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
const messageConst = require('../config/constMessage');


//create site settings need jwt token of site
router.post('/create', JwtAuth.verifyToken, async (req, res) => {
    try {
        const siteSetting = await db.siteSettingModel.create({
            siteLogo: req.body.siteLogo,
            faviConIcon: req.body.faviConIcon,
            payPalClientId: req.body.payPalClientId,
            payPalclientSecret: req.body.payPalclientSecret,
            notificationKey: req.body.notificationKey,
            footerCopyRight: req.body.footerCopyRight,
            faceBookLink: req.body.faceBookLink,
            youTubeLink: req.body.youTubeLink,
            linkedinLink: req.body.linkedinLink,
            twitterLink: req.body.twitterLink,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        })
        if (!siteSetting) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            message: messageConst.siteSettingCreateSuccess
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }

})
//update image
var uploadImage = multer(imagesUpload).single('image');
router.post('/imageuplaod', uploadImage, async (req, res) => {
    try {
        if (!req.file) {
            return res.send({
                status: 204,
                message: messageConst.NoContent
            });
        }
        return res.status(200).send({
            status: 200,
            data: "images/" + req.file.filename
        });
    } catch (error) {
        console.log(error)
        res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//update site setting
router.post('/update/:id', JwtAuth.verifyToken, async (req, res) => {
    try {
        const siteSettingUpdate = await db.siteSettingModel.update(req.body, { where: { id: req.params.id } })
        if (!siteSettingUpdate) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            message: messageConst.updateSuccuss
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//get setting by id
router.get('/getsetting', async (req, res) => {
    try {
        const siteSetting = await db.siteSettingModel.findOne({})
        if (!siteSetting) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: siteSetting
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


module.exports = router;
