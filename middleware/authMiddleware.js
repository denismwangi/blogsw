const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/userModel');

const protect = asyncHandler(async(req,res,next) =>{
    let token;
    let success;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
    }

    if(token){
        try{
           const decoded = jwt.verify(token,process.env.JWT_SECRET);
           req.user = await User.findById(decoded.userId).select('-password');
           next();
           success = true;
        
           console.log(decoded.userId);
          
        }catch(error){
            console.log(error);
            res.status(401);
            success = false;
            throw new Error('Unauthorized not token token failed');
    
        }

    }else{
        res.status(401);
        success = false;
        throw new Error('Unauthorized no token');
    }

});

const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
            throw new Error('Unauthorized as admin');
    }
}

module.exports =  {admin,protect};