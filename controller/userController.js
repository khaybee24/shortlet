/* eslint-disable no-unused-vars */
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const Property = require('../model/properties');
const port = process.env.PORT



const SignUp = async (req, res)=> {
    try {
        const {name, email, password,confirmPassword, role} = req.body;

        if (password !== confirmPassword) {
          return res.status(403).json({message: "check both password and confirm password and try again"})
        }
    
        const user = await User.findOne({email: email});

        if (user) {
            return res.status(400).json({message: 'user already exists please login'})
        };

        const Hash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name:name,
            email:email,
            password:Hash,
            role:role
        })

        await newUser.save();
        const { password: _, ...userData } = newUser.toObject();

      const transporter = require('../services/nodemailer')

          // Define the email options
          const mailOptions = {
            from: process.env.USER_EMAIL,
            to: `${newUser.email}`,
            subject: "Welcome",
            text: `Dear ${newUser.name} welcome to our website`
          };
      
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error occurred:", error);
            } else {
              console.log("Email sent:", info.response);
            }
          });


        return res.status(200).json({message: 'User saved successfully', user:userData});
    } catch (error) {
      console.log(error);
      
        return res.status(500).json({message:'internal server error',error});
    }

}


const Login = async (req,res) => {
    try {
        const{email,password} = req.body;

        const checkUser = await User.findOne({email: email});

        if (!checkUser) {
            return res.status(404).json({message: 'User not found'});
        }

        const passCheck = await bcrypt.compare(password, checkUser.password)

        if (!passCheck) {
            return res.status(404).json({message: 'incorrect password'});
        };
        const expirationTime = process.env.expires_In;
        const payload = {
          userId: checkUser._id,
          role: checkUser.role
        };
        
        const access_token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: expirationTime }
          );
          // console.log(token)
          
            
        const refresh_token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1w' }
          );

          res.cookie("access_token", access_token,  { 
            httpOnly: true,
            maxAge: 24*60*60*1000
          })

          
          res.cookie('refresh_token',refresh_token, { 
            httpOnly: true,
            maxAge: 7*24*60*60*1000
          })

        const dataInfo = {
          status: "success",
          message: "User Login successful",
          access_token
        };

        return res.status(200).json({message: "user logged in successfully", dataInfo})

    } catch (error) {
      console.log(error);
      
        return res.status(500).json({message:"internal server error",error})
}};

const ForgotPassword = async (req, res) => {
    try {
        const {email} = req.body

        const user = await User.findOne({email: email})

        if (!user) {
            return res.status(404).json({message:"user not found please register"})
        }

        const token = crypto.randomBytes(40).toString('hex')
        const tokenExpiration = Date.now() + 3600000

        user.resetToken = token;
        user.resetTokenExpiry = tokenExpiration;
        
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASSWORD,
            },
          });
      
          // Define the email options
          const mailOptions = {
            from: process.env.USER_EMAIL,
            to: `${user.email}`,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) 
            have requested the reset of the password for your account.
            Please click on the following link, or paste this into your browser to complete the process:
            http://localhost:${port}/api/v1/users/reset/${token}
            If you did not request this, please ignore this email and your password will remain unchanged.`
          };
      
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error occurred:", error);
            } else {
              console.log("Email sent:", info.response);
            }
          });

        return res.status(200).json({message: 'check your mail'})
    } catch (error) {
        return res.status(500).json({message: 'server error',error});
    }
};


const ResetPassword = async (req, res) => {
    try {
        const {token} = req.params

        const {password} = req.body

        const user = await User.findOne({resetToken: token, resetTokenExpiry: {$gt: Date.now() } })

        if(!user) {
            return res.status(404).json({message:"invalid token or expired"})
        }

        const hashpasword = await bcrypt.hash(password, 12);

        user.password = hashpasword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save()

        return res.status(200).json({message: 'user password updated successfully'})
    } catch (error) {
        return res.status(500).json({message:" internal server error",error})
    }
}

const search = async (req, res) => {
  const { propertyName, location, price } = req.query;

  try {
    const query = {};

    // Add parameters to the query object only if they exist
    if (propertyName) {
      query.propertyName = propertyName; // Add propertyName to query
    }
    if (location) {
      query.location = location; // Add location to query
    }
    if (price) {
      query.price = price; // Add price to query (ensure price is a number if necessary)

   if (isNaN(price)) {

    return res.status(404).json({message:"price must be a number"});
   }}
  
    const properties = await Property.find(query)

    
    if (!properties || properties.length === 0) {
      return res.status(404).json({message: 'No properties found'})
    }
    
    return res.status(200).json({message: 'properties found', properties})
    
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({message:"internal server error",error})
  }

}

const fetchAllProperties = async (req, res) =>{
  try {
    const properties = await Property.find({}).limit(10).lean()
    
    if (!properties || properties.length === 0) {
      return res.status(404).json({message: 'No properties found'})
    }
   
    return res.status(200).json({message: 'properties found', properties})

  } catch (error) {
    return res.status(500).json({message:"internal server error",error})
  }
}

module.exports = { SignUp, Login, ForgotPassword, ResetPassword, search, fetchAllProperties }