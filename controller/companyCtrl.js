var express = require('express');
var router = express.Router();
var db = require("../model");
var jwt = require("jsonwebtoken");
var config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
const messageConst = require('../config/constMessage');
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
var companyModel = db.companyModel;
var activityLogModel = db.activityLogModel;


// company singup
router.post('/singup', async (req, res) => {
    try {
        const emailExits = await db.employeeModel.findOne({
            where: {
                email: req.body.email
            }
        })
        if (emailExits) {
            return res.send({
                status: 210,
                message: messageConst.emailAlreadError
            });
        }
        const mobileNoExits = await db.employeeModel.findOne({
            where: {
                mobileNo: req.body.mobileNumber
            }
        })
        if (mobileNoExits) {
            return res.send({
                status: 209,
                message: messageConst.mobileAreadyError
            })
        }
        const employee = await db.employeeModel.findOne({
            where: {
                userName: req.body.userName
            }
        })
        if (employee) {
            return res.send({
                status: 208,
                message: messageConst.alreadyExist
            });
        }
        const userExits = await companyModel.findOne({ where: { userName: req.body.userName } })
        if (!userExits) {
            const company = await companyModel.create({
                name: req.body.name,
                userName: req.body.userName,
                password: bcrypt.hashSync(req.body.password, 8),
                roleId: req.body.roleId,
                email: req.body.email,
                mobileNumber: req.body.mobileNumber,
                address: req.body.address,
                status: 1
            })
            if (!company) {
                return res.status(204).send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
            const employee = await db.employeeModel.create({
                name: req.body.name,
                userName: req.body.userName,
                employeeCode: "company" + company.id,
                password: bcrypt.hashSync(req.body.password, 8),
                email: req.body.email,
                mobileNo: req.body.mobileNumber,
                roleId: req.body.roleId,
                companyId: company.id,
                regionId: req.body.regionId,
                status: 1,
                createdBy: company.id,
                updatedBy: company.id
            })
            return res.status(200).send({
                status: 200,
                message: messageConst.companySuccuss
            });
        }
        return res.status(208).send({
            status: 208,
            message: messageConst.alreadyExist
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//sign in
router.post('/login', async (req, res) => {
    try {
        const companyExits = await companyModel.findOne({
            where: {
                userName: req.body.userName,
                status: 1
            }
        })
        if (companyExits) {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                companyExits.password
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 401,
                    message: messageConst.invalidPass
                });
            }
            else {
                var token = jwt.sign({ id: companyExits.id, roleId: companyExits.roleId }, config.secret, { expiresIn: "12d" });
                return res.send({
                    status: 200,
                    token: token
                });
            }
        }
        else {
            return res.send({
                status: 404,
                message: messageConst.userNotFound
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

//update company
router.post('/update/:id', async (req, res) => {
    console.log(req.body)
    try {
        const id = req.params.id;
        let updateObject = {};
        if (req.body.name) {
            updateObject.name = req.body.name;
        }
        if (req.body.email) {
            updateObject.email = req.body.email;
        }
        if (req.body.mobileNumber) {
            updateObject.mobileNumber = req.body.mobileNumber;
        }
        if (req.body.address) {
            updateObject.address = req.body.address;
        }
        if (req.body.status) {
            updateObject.status = req.body.status;
        }
        const updateComapy = await companyModel.update(updateObject,
            { where: { id: id } })
        if (!updateComapy) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        const activity = await activityLogModel.create({
            userId: id,
            message: "company information has been updated successfully",
            dateTime: Date.now(),
            activityOperationType: "update",
            activityType: "company",
            createdby: id,
            updatedby: id
        })
        return res.send({
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

//company list
router.get('/list', async (req, res) => {
    try {
        const include = [{
            model: db.roleModel,
            required: false,
            attributes: ['name']
        }]
        const companyList = await companyModel.findAll({
            order: [['createdAt', 'DESC']], include: include,
            attributes: ['id', 'name', 'roleId', 'email', 'userName', 'mobileNumber', 'address', 'status', 'createdAt']
        })
        // const results = await Promise.all(companyList.map(async company => {
        //     company = company.toJSON();
        //     company.role = await db.roleModel.findAll({ where: { id: company.roleId }, attributes: ['id', 'name'] })
        //     return company;
        // }))
        if (!companyList) {
            return res.status(404).send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: companyList
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


//change password
router.post('/changepassword/:id', async (req, res) => {
    try {


        const id = req.params.id;
        const adpassword = await db.companyModel.findOne({ where: { id: id } })
        if (!adpassword) {
            return res.send({
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
            const adminpassword = await db.companyModel.update({ password: bcrypt.hashSync(req.body.newPassword, 8) }, { where: { id: id } })
            if (!adminpassword) {
                return res.send({
                    status: 304,
                    message: messageConst.notModified
                });
            }
            const activity = await activityLogModel.create({
                userId: id,
                message: "your password has been changed successfully",
                dateTime: Date.now(),
                activityOperationType: "change password",
                activityType: "company",
                createdby: id,
                updatedby: id
            })
            return res.send({
                status: 200,
                message: messageConst.updatePassword
            })

        }
    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        })
    }

})

//forget password 
router.get('/forgetpassword/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const data = await db.companyModel.findOne({ where: { email: email } })
        if (!data) {
            return res.send({
                status: 404,
                message: messageConst.emailNotFoundError
            });
        }
        console.log(data)
        var token = jwt.sign({ id: data.id }, config.secret, { expiresIn: "10m" });
        const obj = await db.resetPasswordToken.create({
            token: token,
            status: 1,
            createdBy: data.id,
            updatedBy: data.id
        })
        var m = {
            name: data.name,
            userName: data.userName,
            email: data.email,
            link: "http://localhost:4200/company-forget-change-password/" + token
        };
        var msg = EmailBuilder.getCompanyForgetPasswordMessage(m);
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
        })
    }

})

//change forget password 
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
        const data = await db.companyModel.update({ password: bcrypt.hashSync(req.body.password, 8) },
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

//compnay Active Deactive\
router.post('/activedeactive/:id', async (req, res) => {
    try {
        const updateComapy = await companyModel.update(req.body,
            { where: { id: req.params.id } })
        if (!updateComapy) {
            return res.send({
                status: 304,
                message: messageConst.notModified
            });
        }
        const employee = db.employeeModel.update({ status: req.body.status }, { where: { companyId: req.params.id } })
        return res.send({
            status: 200,
            message: messageConst.updateSuccussF
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

module.exports = router;
