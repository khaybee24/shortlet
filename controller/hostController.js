const properties = require('../model/properties');
const cloudinary = require('../utils/cloudinary')
const user = require('../model/userModel')



const postProperties = async (req, res) => {
    const {propertyName,location, date , price, description,amenities} = req.body;


    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({message: "No image provided"});
        }
        const imageUrl =[];

        for(let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrl.push(result.secure_url)};
        
        

        const property = new properties({
            propertyName,
            location,
            date,
            price,
            description,
            amenities,
            userId: req.user.userId
            
        });
        await property.save();
        return res.status(200).json({message: "properties saved successfully", property});
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"internal server error"});
    }
}



module.exports = {postProperties}