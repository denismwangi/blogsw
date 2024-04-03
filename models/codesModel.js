const mongoose = require('mongoose');

const codeSchema = mongoose.Schema(
    {
      user_id: {
        type: String,
        required: true,
      },  
      code: {
        type: String,
        required: true,
      }, 
      otp_expiration: {
        type: String,
        required: true,
      },   
    },
        
    {
      timestamps: true,
    }
);

const OtpCode = mongoose.model('OtpCode',codeSchema);


module.exports = OtpCode;