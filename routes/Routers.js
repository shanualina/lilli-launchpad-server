const express = require("express");
const app = express();
const roles = require("../controller/roleCtrl");
const superadmin = require("../controller/superAdminCtrl");
const permissions = require("../controller/permissionCtrl");
const users = require("../controller/userCtrl");
const role_hash_permission = require("../controller/role_hash_permissionCtrl");
const chatroom = require("../controller/chatRoomCtrl");
// const subUsersRoutes = require("./images");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/superadmin', superadmin);
    app.use('/role', roles);
    app.use('/permission', permissions);
    app.use('/user', users);
    app.use('/rolehashpermission', role_hash_permission);
    app.use('/chatroom', chatroom);
    //read images
    app.use('/images', express.static('./images'));
}