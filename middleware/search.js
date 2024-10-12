const searchParam = (req, res, next) => {
   const {propertyName, location, price} = req.query

    if (propertyName || location || price) {

return next();
    }
    return res.status(400).json({message: "Invalid search parameter"});
}

module.exports = searchParam;