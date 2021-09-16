var express = require('express');
var router = express.Router();
var db = require("../model");
const multer = require('multer');
const messageConst = require('../config/constMessage');
const JwtAuth = require('../midddlewars/JwtAuth');
const fs = require('fs');
const { extname } = require('path');
const path = require("path");
const decodeToken = require('../config/decodeTokon').decodeToken
function fileFilter(res, file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|zip|pdf|xlsx|xlsb|xls|doc|docm|docx/;

    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}
const limits = {
    fieldNameSize: 200,
    files: 20,
    fields: 20
}
const storage = multer.diskStorage({
    destination: './public/file/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + extname(file.originalname));
    }
});
const imagesUpload = {
    fileFilter: fileFilter,
    storage: storage,
    limits: limits
};
var uploadImage = multer(imagesUpload).single('image');

router.post('/save', uploadImage, JwtAuth.verifyToken, async (req, res) => {
    try {
        const id = decodeToken(req, res);
        console.log(id)
        const company = await db.employeeModel.findOne({ where: { id: id } })
        console.log(company)
        const productFile = await db.productFileModel.create({
            projectId: req.body.projectId,
            file: 'file/' + req.file.filename,
            companyId: company.companyId,
        })
        if (!productFile) {
            return res.status(204).send({
                status: 204,
                message: messageConst.NoContent
            });
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.fileUploadSucsess
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})

router.get('/list/:id', async (req, res) => {
    console.log(req.params)
    const productFileList = await db.productFileModel.findAll({where: { projectId: req.params.id }})
    if (!productFileList) {
        return res.send({
            message: messageConst.listblank,
            status: 500
        })
    }
    return res.send({
        data: productFileList,
        status: 200
    })
})
module.exports = router;