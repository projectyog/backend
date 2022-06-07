const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const sendEmail = require('../utils/emails/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


//  1.service for registration of user

const signup = async (data)=>{
    let user = await User.findOne({email:data.email});

    if(user){
        throw new Error(' Your Email already exist');
    }
    user = new User(data);

    const token = JWT.sign({id:user._id},JWTSecret);
    await user.save();
    return(data = {
        userId: user._id,
        email:user.email,
        name:user.name,
        token: token,
    });
};

// 2. service for requesting password reset

const requestPasswordReset = async(email) =>{
    const user = await User.findOne({email});

    if(!user) throw new Error('Email doest not exist');

    let token = await Token.findOne({userId:user._id})
    if(token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken,Number(bcryptSalt))

   await new Token({
       userId:_id,
       token:hash,
       createdAt:Date.now(),
   }).save();

   const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

   sendEmail(user.email,
    "password reset request",
    {
        name: user.name,
        link: link,
    },
    "./template/requestResetPassword.handlebars"
   );
   return link;
};


// service for reset password

const resetPassword = async(userId,token,password) =>{
    let passwordResetToken = await Token.findOne({userId});

    if(!passwordResetToken){
        throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token,passwordResetToken.token);

    if(!isValid){
        throw new Error('Invalid or expired password reset token ');
    }
    
    const hash = await bcrypt.hash(password,Number(bcrypt));

    await User.updateOne(
        {_id:userId},
        {$set:{password:hash} },
        {new:true}
    );

    const user = await User.findById({_id:userId});

    sendEmail(
        user.email,
        "your password reset successfully",
        {
            name : user.name,
        },
        "../template/resetPassword.handlebars"
    );

    await passwordResetToken.deleteOne();
    return true;

};

module.exports = {
    signup,
    requestPasswordReset,
    resetPassword,
}