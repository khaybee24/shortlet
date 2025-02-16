/* eslint-disable no-unused-vars */

const User = require('../model/userModel');



const getUser = async (req, res) => {
    const userId = req.query.name;

    try {
        const user = await User.find(userId).lean();

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const usersWithoutPasswords = user.map(({ password , ...userDetails }) => userDetails);

        return res.status(200).json({ users: usersWithoutPasswords });
    } catch (error) {
        return res.status(500).json({message:'internal server error',error});
    }
}

module.exports = getUser;