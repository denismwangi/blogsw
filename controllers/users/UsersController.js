const asyncHandler  = require('../../middleware/asyncHandler');
const User = require('../../models/userModel');
const generateToken = require('../../utils/generateToken');

const getUsers = asyncHandler(async(req,res) => {
    console.log('here');
    res.send('users');
});

const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            success:true


        });
    }else{
        res.status(404);
        throw new Error('user not found');
    }
});

const updateUserProfile = asyncHandler(async(req,res) => {
    
    if (!password || !user_id) {
        return res.status(400).json({ success: false, errors: { password: "Password is required", user_id: "User ID is required" } });
    }
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email= req.body.email || user.email;
        user.phone= req.body.phone || user.phone;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isVerified: updatedUser.isVerified,
            isAdmin: updatedUser.isAdmin,
            success:true

        });
        
    }else{
        res.status(404);
        throw new Error('User not found');
    }
    
});
module.exports =  {
    getUserProfile,
    updateUserProfile,
};

const deleteUser = asyncHandler(async(req,res) => {
    
});

const getUserById = asyncHandler(async(req,res) => {
    
});

const updateUserById = asyncHandler(async(req,res) => {
    
});

module.exports =  {
    getUsers,
    deleteUser,
    getUserById,
    updateUserById,
    getUserProfile,
    updateUserProfile
};