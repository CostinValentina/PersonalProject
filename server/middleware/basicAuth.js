const jwt = require("jsonwebtoken");
const User = require("../models/User");
//const SECRET_KEY = "helloworld95454";   //I USED MY SECRET_KEY 
const dotenv = require("dotenv");
//const BindUsers  = require("../models/bindUsers")

//in this file i have to change with bindUser because i want also employee permision 

const SecureAPI = (roles) => {
  let role_arr = roles ? roles.split(",") : [];
  return function (req, res, next) {
    let token = req.headers.authorization || req.headers.token;
    if (!token) {
      res.status(401).send("Token is required.");
    }
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, token_data) {
      if (err) {
        res.status(401).send("Token is invalid.");
      } else {
        if (token_data) {
          User.findOne({ email: token_data.email })
            .then((user) => {
              if (user) {
                let role_assigned = user.role;
                let _access = role_arr.includes(role_assigned);
                if (_access === true) {
                  req.token_data = user;
                  return next();
                } else {
                  res.status(401).send("Unauthorized access.");
                }
              } else {
                res.status(401).send("User does not exist.");
              }
            })
            .catch((err) => next(err));
        }
      }
    });
  };
};

module.exports = { SecureAPI };