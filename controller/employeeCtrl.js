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
const JwtAuth = require('../midddlewars/JwtAuth');
const decodeToken = require('../config/decodeTokon').decodeToken
const Op = db.Sequelize.Op;
var employeeModel = db.employeeModel;
var activityLogModel = db.activityLogModel;
const pagination = require('../config/pagination');
const commentModel = require('../model/comment.model');

/* GET home page. */
router.post('/', function (req, res, next) {
    var m = {
        NAME: "shanoo",
        PASSWORD: '1122',
    };
    var msg = EmailBuilder.getForgetPasswordMessage(m);
    msg.to = 'sanuvish11@gmail.com';
    var ser = new EmailService()
    ser.sendEmail(msg, function (err, result) {
        if (result) {
            res.json({
                status: 1,
                message: "Password Has Been Send Sucessfully"
            });
        }
        if (err) {
            console.log(err)
            // res.send({
            //     status: 4,
            //     message: "Email Id Not Found!"
            // });
        }

    })
    //res.render('index', { title: 'Express' });
});

//employee sing-up
router.post('/singup', async (req, res, next) => {
    try {
        let companyId;
        let updatedBy;
        let createdBy;
        const id = decodeToken(req, res);

        const employee = await db.employeeModel.findOne({
            where: {
                id: id
            }
        })
        // console.log(employee)

        if (employee.roleId == 2) {
            const company = await db.companyModel.findOne({
                where: {
                    id: id
                }
            })
            companyId = company.id;
            updatedBy = company.id;
            createdBy = company.id;
        }
        else {
            companyId = employee.companyId;
            updatedBy = employee.id;
            createdBy = employee.id;
        }
        console.log(companyId, updatedBy, createdBy)

        const companyTransaction = await db.companyTransactionModel.findAll({
            where: {
                companyId: companyId
            },
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('noOfUser')), 'userCount'],
            ], raw: true,
        })
        const employeeCount = await employeeModel.findAndCountAll({ where: { companyId: companyId } })
        if (parseInt(companyTransaction[0].userCount) === employeeCount.count) {
            return res.send({
                status: 429,
                message: messageConst.employeeLimitError
            })
        } else {
            const emailExits = await employeeModel.findOne({
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
            const mobileNoExits = await employeeModel.findOne({
                where: {
                    mobileNo: req.body.mobileNo
                }
            })
            if (mobileNoExits) {
                return res.send({
                    status: 209,
                    message: messageConst.mobileAreadyError
                });
            }
            const employee = await employeeModel.findOne({
                where: {
                    userName: req.body.userName
                }
            })
            if (employee) {
                return res.send({
                    status: 208,
                    message: messageConst.alreadyExist
                });
            } else {
                const emp = employeeModel.create({
                    name: req.body.name,
                    userName: req.body.userName,
                    employeeCode: req.body.employeeCode,
                    password: bcrypt.hashSync(req.body.password, 8),
                    email: req.body.email,
                    mobileNo: req.body.mobileNo,
                    roleId: req.body.roleId,
                    companyId: companyId,
                    regionId: req.body.regionId,
                    status: 1,
                    createdBy: createdBy,
                    updatedBy: updatedBy
                })
                if (!emp) {
                    res.status(204).send({
                        status: 204,
                        message: messageConst.NoContent
                    });
                }
                else {
                    res.status(200).send({
                        status: 200,
                        message: messageConst.employeeCreateSuccuss
                    });
                }
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
});

//sign in
router.post('/login', async (req, res) => {
    try {
        const employee = await employeeModel.findOne({
            where: {
                userName: req.body.userName,
                status: 1
            }
        })
        if (employee) {
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                employee.password
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 401,
                    message: messageConst.invalidPass
                });
            }
            else {
                var token = jwt.sign({ id: employee.id, roleId: employee.roleId }, config.secret, { expiresIn: "12d" });
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
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//update 
var uploadImage = multer(imagesUpload).single('image');
router.post('/update/:id', uploadImage, JwtAuth.verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        if (req.file) {
            const user = await employeeModel.update({ profilePic: 'images/' + req.file.filename }, { where: { id: id } })
            console.log(user, 'user')
            if (user == 1) {
                // const employeeInfo = await employeeModel.findOne({ where: { id: id } })
                const activity = await activityLogModel.create({
                    userId: id,
                    message: "your profile has been updated successfully",
                    dateTime: Date.now(),
                    activityOperationType: "update",
                    activityType: "employee",
                    createdby: id,
                    updatedby: id
                })
                res.status(200).send({
                    status: 200,
                    message: messageConst.updateSuccuss
                });
            }
            else {
                res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
        }
        else {
            const user = await employeeModel.update(req.body, { where: { id: id } })
            if (user == 1) {
                const activity = await activityLogModel.create({
                    userId: id,
                    message: "your profile has been updated successfully",
                    dateTime: Date.now(),
                    activityOperationType: "update",
                    activityType: "employee",
                    createdby: id,
                    updatedby: id
                })
                res.send({
                    status: 200,
                    message: messageConst.updateSuccuss
                });
            }
            else {
                res.send({
                    status: 204,
                    message: messageConst.NoContent
                });
            }
        }

    } catch (error) {
        console.log(error)
        res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//change password
router.post('/changepassword/:id', JwtAuth.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const empPassword = await db.employeeModel.findOne({ where: { id: id } })
        if (!empPassword) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        else {
            const activity = await activityLogModel.create({
                userId: id,
                message: "your password has been changed successfully",
                dateTime: Date.now(),
                activityOperationType: "change password",
                activityType: "employee",
                createdby: id,
                updatedby: id
            })
            var passwordIsValid = bcrypt.compareSync(
                req.body.currentPassword,
                empPassword.password
            );
            if (!passwordIsValid) {
                return res.send({
                    status: 401,
                    message: messageConst.invalidCurrentPass
                });
            }
            const employeePassword = await db.employeeModel.update({ password: bcrypt.hashSync(req.body.newPassword, 8) }, { where: { id: id } })
            if (!employeePassword) {
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
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }

})

//get employee by companyid JwtAuth.verifyToken,
router.get('/employeelist', async (req, res) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = pagination.getPagination(page, size);
        let companyId;
        const id = decodeToken(req, res);
        const employee = await db.employeeModel.findOne({
            where: {
                id: id
            }
        })
        companyId = employee.companyId;
        // console.log(employee)
        // if (employee.roleId == 2) {
        //     const company = await db.companyModel.findOne({
        //         where: {
        //             id: id
        //         }
        //     })
        //     companyId = company.id;
        // }
        // else {
        //     companyId = employee.companyId;
        // }
        const include = [{
            model: db.companyModel,
            required: false,
            attributes: ['name']
        }, {
            model: db.roleModel,
            required: false,
            attributes: ['name']
        }, {
            model: db.regionModel,
            required: false,
            attributes: ['name']
        }]
        const companyEmployee = await db.employeeModel.findAll({ where: { companyId: companyId }, include: include, })
        if (!companyEmployee) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: companyEmployee
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

//forget password send tem link to email
router.get('/forgetpassword/:email', async (req, res) => {
    try {
        const data = await db.employeeModel.findOne({ where: { email: req.params.email } })
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
            link: "http://localhost:4200/employee-forget-change-password/" + token
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
        const data = await db.employeeModel.update({ password: bcrypt.hashSync(req.body.password, 8) },
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

//get profile by id
router.get('/getProfile/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const companyEmployee = await db.employeeModel.findOne({ where: { id: id } })
        if (!companyEmployee) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: companyEmployee
        })
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


//delete record byn user
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const employeeDelete = await db.employeeModel.destroy({ where: { id: id } })
        if (!employeeDelete) {
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

router.get('/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const id = decodeToken(req, res);
        const employee = await db.employeeModel.findOne({
            where: { id: id }
        })
        const employeeList = await db.employeeModel.findAll({
            where: {
                companyId: employee.companyId,
                name: { [Op.like]: `%${name}%` }
            }
        })
        if (!employeeList) {
            return res.json({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data:employeeList
        })

    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        })
    }

})
module.exports = router;
