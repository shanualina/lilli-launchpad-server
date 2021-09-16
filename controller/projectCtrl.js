var express = require('express');
var router = express.Router();
var db = require("../model");
const multer = require('multer');
const messageConst = require('../config/constMessage');
const imagesUpload = require('../config/imageUplaod').imagesUpload;
var projectModel = db.projectModel;
var companyTransactionModel = db.companyTransactionModel;
//create project 
var uploadImage = multer(imagesUpload).single('image');
const JwtAuth = require('../midddlewars/JwtAuth');
const { count } = require('console');

router.post('/uploadImage', uploadImage, async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(204).send({
                status: 204,
                message: messageConst.NoContent
            })
        }
        return res.status(200).send({
            status: 200,
            data: 'images/' + req.file.filename
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

router.post('/save', JwtAuth.verifyToken, async (req, res, next) => {
    const decodeToken = require('../config/decodeTokon').decodeToken
    const id = decodeToken(req, res);
    try {
        let companyId;
        let updated;
        let created;
        const employee = await db.employeeModel.findOne({
            where: {
                id: id
            }
        })
        companyId = employee.companyId;
        updated = employee.companyId;
        created = employee.companyId;
        console.log(created)
        // if (employee.roleId == 2) {
        //     const company = await db.companyModel.findOne({
        //         where: {
        //             id: id
        //         }
        //     })
        //     companyId = company.id;
        //     updatedBy = company.id;
        //     createdBy = company.id;
        //     console.log(company)
        // }
        // else {
           
       // }
        const companyTransaction = await db.companyTransactionModel.findAll({
            where: {
                companyId: companyId
            },
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('noOfProject')), 'projectsum'],
            ], raw: true,
        })
        const projectCount = await projectModel.findAndCountAll({ where: { companyId: companyId } })
        if (parseInt(companyTransaction[0].projectsum) === projectCount.count) {
            return res.send({
                status: 429,
                message: messageConst.projectLimitError
            })
        }
        else {
            const projectExits = await projectModel.findOne({ where: { projectName: req.body.projectName } })
            if (!projectExits) {
                const project = projectModel.create({
                    projectName: req.body.projectName,
                    companyId: companyId,
                    regionId: req.body.regionId,
                    status: req.body.status,
                    createdby: created,
                    updatedby: updated
                })
                if (!project) {
                    return res.status(204).send({
                        status: 204,
                        message: messageConst.NoContent
                    })
                }
                return res.status(200).send({
                    status: 200,
                    message: messageConst.ProjectSuccuss
                })
            }
            return res.status(208).send({
                status: 208,
                message: messageConst.projectExist
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//update project
router.post('/update/:id', JwtAuth.verifyToken, uploadImage, async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(req.body)
        let updateObject = {};
        if (req.body.projectName) {
            updateObject.projectName = req.body.projectName;
        }
        if (req.file) {
            updateObject.projectPic = 'images/' + req.file.filename;
        }
        if (req.body.responsivePerson) {
            updateObject.responsivePerson = req.body.responsivePerson;
        }
        if (req.body.companyId) {
            updateObject.companyId = req.body.companyId;
        }
        if (req.body.startDate) {
            updateObject.startDate = req.body.startDate;
        }
        if (req.body.endDate) {
            updateObject.endDate = req.body.endDate;
        }
        if (req.body.regionId) {
            updateObject.regionId = req.body.regionId;
        }
        if (req.body.createdby) {
            updateObject.createdby = req.body.createdby;
        }
        if (req.body.updatedby) {
            updateObject.updatedby = req.body.updatedby;
        }
        const project = projectModel.update(updateObject, { where: { id: id } })
        if (!project) {
            return res.status(304).send({
                status: 304,
                message: messageConst.notModified
            })
        }
        return res.status(200).send({
            status: 200,
            message: messageConst.updateSuccuss
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})
//delete project
router.delete("/delete/:id", JwtAuth.verifyToken, async (req, res, next) => {
    try {
        const result = await projectModel.destroy({ where: { id: req.params.id } })
        if (!result) {
            return res.status(404).json({
                status: 404,
                message: messageConst.deleteError
            });
        }
        return res.status(200).json({
            status: 200,
            message: messageConst.deleteSucess
        });

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        })
    }
})

//project list
router.get('/list', JwtAuth.verifyToken, async (req, res) => {
    try {
        const projectList = await projectModel.findAll({})

        const results = await Promise.all(projectList.map(async posts => {
            posts = posts.toJSON();
            posts.projectPic = 'http' + req.headers.host + '/' + posts.projectPic
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
//project list by company id
router.get('/projectlist/:companyId', JwtAuth.verifyToken, async (req, res) => {
    console.log(req.params)
    try {
        const projectList = await projectModel.findAll({ where: { companyId: req.params.companyId } })
        const results = await Promise.all(projectList.map(async posts => {
            posts = posts.toJSON();
            posts.projectPic = 'http://' + req.headers.host + '/' + posts.projectPic
            return posts;
        }))
        if (!results) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: results
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//project list by company id
router.get('/getproject/:projetcId', JwtAuth.verifyToken, async (req, res) => {
    try {
        const project = await projectModel.findOne({ where: { id: req.params.projetcId } })
        if (!project) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.status(200).send({
            status: 200,
            data: project
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
