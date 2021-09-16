var express = require('express');
var router = express.Router();
var db = require("../model");
const messageConst = require('../config/constMessage');
var companyTransactionModel = db.companyTransactionModel;
const paypal = require('paypal-rest-sdk');

//paypal integration
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVBqk_3NHbFcUI4muhx54lYuAhZg4mY-o7KoD6A_X7RgBrJYTJdYnc1R90kar81T3E1uZeypqi36C8KI',
    'client_secret': 'EGIWk0Qy0laZoOGU-7zQKtMcoJ2ODFpuOP2wFCq9UcEzvBnbJvAMzd6HWoJyvANytfF_adVFsOXziLLC'
});



router.post('/makepayment', async (req, res) => {
    paypal.payment.create({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4200/company-dashboard",
            "cancel_url": "http://localhost:4200/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": req.body.packageName,
                    "sku": "item",
                    "price": req.body.price,
                    "currency": "INR",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "INR",
                "total": req.body.price
            },
            "description": "This is the payment description."
        }]
    }, function (error, payment) {
        if (error) {
            return res.send({
                status: 500,
                message: error
            })
        }
        return res.send({
            status: 201,
            payment: payment
        });
    });

})
//payment now
router.post('/process', function (req, res) {
    var paymentId = "PAYID-MEW4KOY36P741074B173532J";
    var payerId = { 'payer_id': "1" };

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error(error);
        } else {
            if (payment.state == 'approved') {
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        }
    });
});



//create company transaction
router.post('/create', async (req, res) => {
    try {
        const companyTransaction = await companyTransactionModel.create({
            companyId: req.body.companyId,
            packageId: req.body.packageId,
            transactionAmount: req.body.transactionAmount,
            orderId: req.body.orderId,
            paymentId: req.body.paymentId,
            paymentResponse: req.body.paymentResponse,
            noOfUser: req.body.noOfUser,
            noOfProject: req.body.noOfProject,
            transactionDetail: req.body.transactionDetail,
            status: req.body.status,
            createdby: req.body.createdby,
            updatedby: req.body.updatedby
        })

        if (!companyTransaction) {
            return res.send({
                status: 204,
                message: messageConst.craeteTransactionError
            });
        }
        const package = await db.packageModel.findOne({ where: { id: req.body.packageId } })
        var d = new Date();
        let nMonths = package.packageDuration / 30;
        d.setDate(d.getDate() - 1);
        let month = Math.ceil(nMonths);
        var endDate = d.setMonth(d.getMonth() + month);
        const company = await db.companyModel.update({ planId: req.body.packageId, expiryDate: endDate }, {
            where: {
                id: req.body.companyId,
            }
        })
        return res.send({
            status: 200,
            message: messageConst.transactionSuccuss
        });
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//get all company transaction
router.get('/list', async (req, res) => {
    try {
        const include = [{
            model: db.packageModel,
            required: false,
        }, {
            model: db.companyModel,
            required: false,
            attributes: ['name']
        }]
        const companyTransactionList = await companyTransactionModel.findAll({
            order: [['createdAt', 'DESC']],

            include: include
        })
        if (!companyTransactionList) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: companyTransactionList
        });

    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//get company transaction by company id
router.get('/gettransaction/:companyId', async (req, res) => {
    try {
        const include = [{
            model: db.packageModel,
            required: false,
        }]
        const companyTransaction = await companyTransactionModel.findOne({
            order: [['createdAt', 'DESC']],
            where: {
                companyId: req.params.companyId
            }, include: include,
        })
        if (!companyTransaction) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: companyTransaction
        });

    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})
//last transication detail
router.get('/lasttransaction', async (req, res) => {
    try {
        const include = [{
            model: db.packageModel,
            required: false,
        }]
        const companyTransaction = await companyTransactionModel.findOne({
            limit: 1,
            include: include,
            order: [['createdAt', 'DESC']]
        })
        if (!companyTransaction) {
            return res.send({
                status: 404,
                message: messageConst.listblank
            });
        }
        return res.send({
            status: 200,
            data: companyTransaction
        });

    } catch (error) {
        return res.send({
            status: 500,
            message: messageConst.unableProcess
        });
    }
})


module.exports = router;
