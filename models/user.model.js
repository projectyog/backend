const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;

const userSchema = new Schema({

    name:{

        type:String,
        required:true,
        unique:true,
        trim:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },

    password:{
        type:String
    },
},
    {
        timestamps : true,
    }
);

userSchema.pre("save",async function(next){
if(!this.isModified('password')){
    return next();
}

const hash = await bcrypt.hash(this.password,Number(bcryptSalt))
this.password = hash;
next();
});

const Users = new mongoose.model("USER",userSchema)
module.exports = Users;