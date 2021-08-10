var express = require('express');
var router = express.Router();
var db = require("../model");
var bcrypt = require("bcryptjs");
var config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const multer = require('multer');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
var superAdmin = db.superAdminModel;

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
                roleId: req.body.roleId,
                status: 1,
            })
            if (!user) {
                return res.status(204).send({
                    status: 204,
                    message: "req body is empty!"
                });
            }
            return res.status(201).send({
                message: "create Sucessfully!",
                status: 201,
            });
        }
        return res.send({
            message: "username already exits!",
            status: 208,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 500,
            message: "unable to process!"
        });
    }
});

//sign in
router.post('/login', async (req, res) => {
    try {
        const user = await superAdmin.findOne({
            userName: req.body.userName
        }).catch(err => {
            console.log(err)
            res.status(500).send({
                status: 500,
                message: "uable to process!"
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
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "unable to process!"
        });
    }
})

// //update 
// var uploadImage = multer(imagesUpload).single('image');
// router.post('/update/:id', uploadImage, async (req, res) => {
//     const id = req.params.id;
//     try {
//         console.log(req.file)
//         console.log(req.body)
//         if (req.file) {
//             const user = await login.update({ profilePic: 'images/' + req.file.filename }, { where: { id: id } })
//             console.log(user, 'user')
//             if (user == 1) {
//                 res.status(200).send({
//                     status: 200
//                 });
//             }
//             else {
//                 res.status(204).send({
//                     status: 204,
//                 });
//             }
//         }
//         else {
//             const user = await login.update(req.body, { where: { id: id } })
//             if (user == 1) {
//                 res.status(200).send({
//                     status: 200,
//                 });
//             }
//             else {
//                 res.status(204).send({
//                     status: 204,
//                 });
//             }
//         }


//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             status: 500,
//         });
//     }
// })

module.exports = router;
