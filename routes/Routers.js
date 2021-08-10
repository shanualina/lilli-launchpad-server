const express = require("express");
const app = express();
const roles = require("../controller/roleCtrl");
const superAdmin = require("../controller/superAdminCtrl");
const permissions = require("../controller/permissionCtrl");
const users = require("../controller/userCtrl");
// const subUsersRoutes = require("./images");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/superadmin',superAdmin);
    app.use('/role',roles);
    app.use('/permission',permissions);
    app.use('/user',users);
    //read images
    app.use('/images', express.static('./images'));
}