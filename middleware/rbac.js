const Host = (req, res, next) => {
    if(req.user && req.user.role === 'Host') {

        return next()

    }else {
        return res.status(403).json({message: 'Unauthorized: Only hosts can access this route🔥🔥🔥'})
    }
}

const Admin = (req, res, next) => {
    if(req.user && req.user.role === 'Admin') {

        return next()
} else {
    return res.status(403).json({message: 'Unauthorized: Only admins can access this route🔐🔐🔐'})
    
}}

const User = (req, res, next) => {
    if(req.user && req.user.role === 'user') {

        return next()
}else {
    return res.status(403).json({message: 'Unauthorized: Only users can access this route🙋🙋🙋'})
}}

module.exports ={ Host, Admin, User }