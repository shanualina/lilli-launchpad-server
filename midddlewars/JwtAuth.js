const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../model");
verifyToken = (req, res, next) => {
  console.log(req.body)
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "Jwt Token Missing!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    next();
  });
};

//
// isAdmin = (req, res, next) => {
//   db.Admin.findByPk(req.userId).then(user => {
//     if (user.adminType === "super") {
//       next();
//       return;
//     }
//     res.status(403).send({
//       message: "No Token Provide"
//     });

//   });
// };

// //admin verify
// isUser = (req, res, next) => {
//   db.User.findByPk(req.userId).then(user => {
//     const roleid = user.roleId;
//     Role.findByPk(roleid).then(roles => {
//       if (roles.name === "user") {
//         next();
//         return;
//       }
//       res.status(403).send({
//         message: "No Token Provide"
//       });
//     })
//   });
// };
const authJwt = {
  verifyToken: verifyToken,
  //isUser: isUser,
};
module.exports = authJwt;
