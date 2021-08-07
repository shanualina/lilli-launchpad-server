const express = require("express");
const app = express();
const loginCtl = require("../controller/loginCtl");
// const subUsersRoutes = require("./images");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/login',loginCtl);
    //read images
    app.use('/images', express.static('./images'));
}