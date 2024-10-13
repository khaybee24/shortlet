const jwt = require("jsonwebtoken");




const jwtSign =(payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })
};

const jwtVerify =(token) =>{
    try{

        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error){
        return error;
    }
};

const isAuthenticated = (req, res, next) => {
    try {
        const token =req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({message: 'unauthorized 🔐🔒🔐🔐'});
        }

        const decoded = jwtVerify(token, process.env.JWT_SECRET);

    if (!decoded) {
        res.status(401).json({message: 'Auth failed'});
    }
    req.user = decoded;
    next();
    } catch (error) {
        return res.status(401).json({message: "Authentication failed: 🔒🔒🔒🔒🔒",error})
    }
}

module.exports = { jwtSign, jwtVerify,isAuthenticated}