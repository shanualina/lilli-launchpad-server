var express = require('express');
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const multer = require('multer');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
var EmailService = require('../mail/EmailService');
var MailMessage = require('../mail/MailMessage');
var EmailBuilder = require('../mail/EmailBuilder');
require('dotenv').config()
var login = db.login;
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

//user sing-up
router.get('/singup', async (req, res, next) => {
    try {
        const user = await login.findOne({
            where: {
                userName: req.body.userName
            }
        })
        if (user) {
            res.send({
                status: 208,
            });
            return;
        } else {
            const user = login.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                password: bcrypt.hashSync(req.body.password, 8),
                email: req.body.email,
                mobileNo: req.body.mobileNo,
                roleId: req.body.roleId,
                status: 1,
            })
            if (user) {
                res.status(201).send({
                    status: 201,
                });
            }
            else {
                res.status(204).send({
                    status: 204,
                });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500
        });
    }
});

//sign in
router.post('/login', async (req, res) => {
    try {
        const user = await login.findOne({
            where: {
                userName: req.body.userName,
                status: 1
            }
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                status: 500,
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
                });
            }
            else {
                var token = jwt.sign({ id: user.id }, config.secret, { expiresIn: "12d" });
                res.status(200).send({
                    status: 200,
                    token: token
                });
            }

        }
        else {
            return res.status(404).send({
                status: 404,
            });
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
        });
    }
})
//update 
var uploadImage = multer(imagesUpload).single('image');
router.post('/update/:id', uploadImage, async (req, res) => {
    const id = req.params.id;
    try {
        console.log(req.file)
        console.log(req.body)
        if (req.file) {
            const user = await login.update({ profilePic: 'images/' + req.file.filename }, { where: { id: id } })
            console.log(user, 'user')
            if (user == 1) {
                res.status(200).send({
                    status: 200
                });
            }
            else {
                res.status(204).send({
                    status: 204,
                });
            }
        }
        else {
            const user = await login.update(req.body, { where: { id: id } })
            if (user == 1) {
                res.status(200).send({
                    status: 200,
                });
            }
            else {
                res.status(204).send({
                    status: 204,
                });
            }
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
        });
    }
})

//delte role 

module.exports = router;
