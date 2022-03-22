//authentication middleware.js
const jwt = require("jsonwebtoken");
const jwt_enc_key = require("../../env").jwt_enc_key;

const checkAuthentication = (req, res, next) =>
{
	token = req.headers["x-access-token"];
    if(token !== undefined && token!== null && token !== "")
    {
        // jwt.verify(token, jwt_enc_key, function(err, decoded){
        //     if(err){
        //         //res.status(401).send({success : false, message : "The user is not authorized."});
        //         req.user_id = 0;
        //     }
        //     req.user_id = decoded.id;
        // });    
    }
    next();
}

module.exports  = checkAuthentication;

