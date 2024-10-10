const mongoose = require('mongoose');

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected sucessfully');
        
    }catch (error) {
        console.log('error connecting to database');
        
    }
}
module.exports = connectDB