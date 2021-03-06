var express = require('express');
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const imagesUpload = require('../config/imageUplaod').imagesUpload;
const multer = require('multer');
const messageConst = require('../config/constMessage');

var usersModel = db.userModel;
//signup
router.post('/signup', async (req, res, next) => {
    try {
        const userExists = await usersModel.findOne({ where: { userName: req.body.userName, } })
        if (!userExists) {
            const user = usersModel.create({
                userName: req.body.userName,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                mobileNo: req.body.mobileNo,
                roleId: req.body.roleId,
                status: 1,
                createdby: req.body.createdby,
                updatedby: req.body.updatedby
            })
            if (!user) {
                return res.status(400).send({
                    status: 400,
                    message: "Bad Request!"
                })
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.createSuccuss
            })
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.alreadyExist
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//singin
router.post('/singin', async (req, res) => {
    try {
        const user = await usersModel.findOne({
            where: {
                userName: req.body.userName
            }
        }).catch(err => {
            console.log(err)
            return res.status(500).send({
                status: 500,
                message: "unbale to process!"
            });
        })
        if (user) {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(404).send({
                    status: 401,
                    message: "invalid password"
                });
            }
            var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: "12d" });
            return res.status(200).send({
                status: 200,
                token: token
            });
        }
        else {
            return res.status(404).send({
                message: "username not found!",
                status: 404,
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
        });
    }
})
//chnage password using primary key
router.post('/changepassword/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await usersModel.findOne({
            where: {
                id: id
            }
        })
        if (!user) {
            return res.status(404).send({
                message: "user not found!",
                status: 404,
            });
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.currentPassword,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(404).send({
                status: 401,
                message: "invalid password"
            });
        }
        else {
            const updatePassword = await usersModel.update({
                password: bcrypt.hashSync(req.body.password, 8),
            }, { where: { id: id } })
            if (!updatePassword) {
                return res.status(304).send({
                    status: 304,
                    message: "Not Modified"
                });
            }
            return res.status(200).send({
                status: 200,
                message: "update sucessfully"
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unable to process!"
        });
    }
})
//update user detail and profile profile pic
var uploadImage = multer(imagesUpload).single('image');
router.post('/update/:id', uploadImage, async (req, res) => {
    const id = req.params.id;
    try {
        if (req.file) {
            const user = await usersModel.update({ profilePic: 'images/' + req.file.filename }, { where: { id: id } })
            if (!user) {
                return res.status(204).send({
                    status: 204,
                    message: "not modified"
                });
            }
            return res.status(200).send({
                status: 200,
                message: "update sucessfully"
            });
        }
        else {
            const user = await usersModel.update(req.body, { where: { id: id } })
            if (!user) {
                return res.status(204).send({
                    status: 204,
                    message: "not modified"
                });
            }
            return res.status(200).send({
                status: 200,
                message: "update sucessfully"
            });
        }
    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: "unable to process"
        });
    }
})


module.exports = router;