var express = require('express');
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const multer = require('multer');
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
const messageConst = require('../config/constMessage');
const decodeToken = require('../config/decodeTokon').decodeToken
const jwt_decode = require("jwt-decode");
const JwtAuth = require('../midddlewars/JwtAuth');
var superAdmin = db.superAdminModel;
//singup
router.post('/singup', async (req, res, next) => {
    try {
        const admin = await superAdmin.findOne({
            where: {
                userName: req.body.userName
            }
        })
        if (!admin) {
            const user = superAdmin.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: bcrypt.hashSync(req.body.password, 8),
                email: req.body.email,
                mobileNo: req.body.mobileNo,
                roleId: 1,
                status: 1,
            })
            if (!user) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            return res.status(201).send({
                message: messageConst.createSuccuss,
                status: 201,
            });
        }
        return res.send({
            message: messageConst.alreadyExist,
            status: 208,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
});
//login
router.post('/login', async (req, res) => {
    try {
        const user = await superAdmin.findOne({
            where: {
                userName: req.body.userName
            }
        })
        if (!user) {
            return res.send({
                message: messageConst.userNotFound,
                status: 404,
            });
        }
        else {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 401,
                    message: messageConst.invalidPass
                });
            }
            var token = jwt.sign({ id: user.id, roleId: user.roleId }, config.secret, { expiresIn: "12d" });
            return res.send({
                status: 200,
                token: token
            });
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

var uploadImage = multer(imagesUpload).single('image');
router.post('/update/:id', uploadImage, JwtAuth.verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        console.log(req.file)
        console.log(req.body)
        if (req.file) {
            const user = await db.superAdminModel.update({ profilePic: 'images/' + req.file.filename }, { where: { id: id } })
            console.log(user, 'user')
            if (!user) {
                return res.status(200).send({
                    status: 200,
                    message: messageConst.updateSuccuss
                });
            }
            return res.status(204).send({
                status: 204,
                message: messageConst.msgNotFound
            });
        }
        else {
            const admin = await db.superAdminModel.update(req.body, { where: { id: id } })
            console
            if (!admin) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.msgNotFound
                });
            }
            return res.status(200).send({
                status: 200,
                message: messageConst.updateSuccuss
            });

        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//change password using decode token
router.post('/changepassword', JwtAuth.verifyToken, async (req, res) => {
    try {
        const id = decodeToken(req, res);
        const adpassword = await db.superAdminModel.findOne({ where: { id: id } })
        if (!adpassword) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        else {
            var passwordIsValid = bcrypt.compareSync(
                req.body.currentPassword,
                adpassword.password
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 401,
                    message: messageConst.invalidCurrentPass
                });
            }
            const adminpassword = await db.superAdminModel.update({ password: bcrypt.hashSync(req.body.newPassword, 8) }, { where: { id: id } })
            if (!adminpassword) {
                return res.send({
                    status: 304,
                    message: messageConst.notModified
                });
            }
            return res.send({
                status: 200,
                message: messageConst.updatePassword
            })
        }
    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//get profile using decode token
router.get('/getprofile', JwtAuth.verifyToken, async (req, res) => {
    try {
        const id = decodeToken(req, res);
        console.log(id)
        const profile = await db.superAdminModel.findOne({ where: { id: id } })
        if (!profile) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: profile
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//forget password
router.get('/forgetpassword/:email', async (req, res) => {
    try {
        const data = await db.superAdminModel.findOne({ where: { email: req.params.email } })
        if (!data) {
            return res.send({
                status: 404,
                message: messageConst.emailNotFoundError
            });
        }
        var token = jwt.sign({ id: data.id }, config.secret, { expiresIn: "10m" });
        const obj = await db.resetPasswordToken.create({
            token: token,
            status: 1,
            createdBy: data.id,
            updatedBy: data.id
        })
        var m = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            link: "http://localhost:4200/change-forget-password/" + token
        };
        var msg = EmailBuilder.getForgetPasswordMessage(m);
        msg.to = data.email;
        var ser = new EmailService()
        ser.sendEmail(msg, function (err, result) {
            if (result) {
                res.json({
                    status: 200,
                    message: "Email has been send to your email please check"
                });
            }
            if (err) {
                res.send({
                    status: 404,
                    message: "Email Id Not Found!"
                });
            }
        })

    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//post
//change forget password using token decode
router.post('/forgetchangepassword/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const obj = await db.resetPasswordToken.findOne({
            where: {
                token: token,
                status: 1
            }
        })
        if (!obj) {
            return res.send({
                status: 404,
                message: messageConst.LinkError
            })
        }
        var decoded = jwt_decode(token);
        const data = await db.superAdminModel.update({ password: bcrypt.hashSync(req.body.password, 8) },
            { where: { id: decoded.id } })
        const updateToken = await db.resetPasswordToken.update({ status: 0 }, {
            where: {
                token: token,
                status: 1
            }

        })
        if (!data) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        return res.send({
            status: 200,
            message: messageConst.newPasswordSucess
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//check token valid or not before change forger password
router.get('/link-valid/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const obj = await db.resetPasswordToken.findOne({
            where: {
                token: token,
                status: 1
            }
        })
        if (obj) {
            return res.send({
                status: 200,
                data: obj
            })
        }
        else {
            return res.send({
                status: 404,
                message: messageConst.LinkError
            })
        }

    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


module.exports = router;
