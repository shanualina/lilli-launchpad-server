const jwt_decode = require("jwt-decode");
function decodeToken(req, res) {
    let token = req.headers["x-access-token"];
    var decoded = jwt_decode(token);
    return decoded.id;
}
function decodeRoleId(req, res) {
    let token = req.headers["x-access-token"];
    var decoded = jwt_decode(token);
   // console.log(decoded)
    return decoded.roleId;
}
module.exports.decodeToken = decodeToken;
module.exports.decodeRoleId = decodeRoleId;