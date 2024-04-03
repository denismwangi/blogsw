const asyncHandler = require('../../middleware/asyncHandler');
const User = require('../../models/userModel');
const OtpCode = require('../../models/codesModel');
const { use } = require('../../routes/usersRoute');
const {generateToken,getToken} = require('../../utils/generateToken');
const sendEmail = require("../../utils/sendEmails");
require("dotenv").config();
const randomInt  = require('../../utils/authCode');
const sendSms = require('../../utils/sendSms');
const registerRequest = require('../../Requests/Auth/authRequests');


const registerUser =  asyncHandler(async(req,res) => {
    const {name,email,phone,password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error('user already exists');
    }
    
    const user = await User.create({
        name,
        email,
        phone,
        password
    });

    if(user){
        const token = generateToken(res,user._id);

        user.token = token
        const updatedUser = await user.save();

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            isVerified: updatedUser.isVerified,
            token:updatedUser.token,
            success:true

        });
    }else{
        res.status(400);
        throw new Error('Invalid user data');

    }
});

const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    
    if(user && (await user.matchPassword(password))){
      const token = generateToken(res,user._id);

      user.token = token
      const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            isVerified: updatedUser.isVerified,
            token:updatedUser.token,
            success:true
        });
    }else{
        res.status(401);
        throw new Error('invalid email or password');
    }
    
});

const logoutUser = asyncHandler(async(req,res) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    }

     const user = await User.findOne({token:token});
     if(user){
        user.token = '';
        const updatedUser = await user.save();

        return res.status(200).json({success:true,message: "Logged out successfully"});
     }else{
        return res.status(200).json({success:false,message: "The user is already logged out"});

     }
    
});

const verifyUser = asyncHandler(async(req,res) =>{
   
    let token;
    token = getToken(req);
    const user = await User.findOne({token:token});
    user.isVerified = true;
    const updatedUser = await user.save();

    if(updatedUser){
        return res.status(200).json({success:true,message: "User verified successfully"});
     }else{
        return res.status(500).json({success:false,message: "Failed to verify user"});
    }
    
})

const resetPassword = asyncHandler(async(req,res) => {
    const {phone} = req.body;

    if (!phone) {
        return res.status(400).json({success:false, message: "Phone number is required." });
    }

    const userExists = await User.findOne({phone});
    if(userExists){
        
        const otp =  randomInt(100000, 999999);
        const message = 'This is your verification code: ' + otp;
        
        try {

          //  sendSms(phone,message);

            const otpCode = await OtpCode.create({
                user_id: userExists._id,
                code: otp,
                otp_expiration: Date.now() + 600000 
            });
            
            res.status(200).json({
                success:true,
                message: "Verification Code Sent Check your phone!",
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({success:false, message: "Internal server error" });
        }

    }
    

})

const updatePassword =  asyncHandler(async(req,res) => {
    const {password,user_id} = req.body;
    if (!password || !user_id) {
        return res.status(400).json({ success: false, message: 'Both password and user_id are required' });
    }


    const user = await User.findOne({_id:user_id});
    user.password = password
    const updatedUser = await user.save();

    if(updatedUser){
        return res.status(200).json({success:true,message: "Password updated successfully"});
    }else{
        return res.status(500).json({success:false,message: "Something went wrong contact admin"});

    }

}) 

const passwordCode =  asyncHandler(async(req,res) => {
    let token;
    token = getToken(req);
    const user = await User.findOne({token:token});
    const code = req.body;

    try {
        const otpCode = await OtpCode.findOne({ code: code.code });

        console.log(otpCode);


        if (!otpCode || otpCode.otp_expiration < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        await OtpCode.deleteOne({ _id: otpCode._id });

        res.status(200).json({ success: true, message: 'Verified successfully',user_id: otpCode.user_id});
    } catch (error) {

        console.error('Error verifying the code:', error);
        res.status(500).json({ success: false, message: 'Failed to verify the code' });
    }

});



module.exports =  {
    registerUser,
    loginUser,
    logoutUser,
    verifyUser,
    resetPassword,
    updatePassword,
    passwordCode
};