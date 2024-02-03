const mongooes = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ErrorHander = require("../utils/errorhander");

const crypto = require("crypto")

const userSchema  = new mongooes.Schema({
    name:{
        type:String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exced more than 30."],
        minLength: [4, "Name should have more than 4 charcter"] 
    },
    email:{
        type:String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password:{
        type:String,
        required: [true, "Please Enter Your Password"],
        maxLength: [8, "password should have more than 8 charcter"],
        select:false
    },
    avtar:{

        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default: "user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


userSchema.pre("save",async function(next){

    if(!this.isModified("password") ){
        next();

    }

    this.password = await bcrypt.hash(this.password,10);
})


//JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}


//Compared password

userSchema.methods.comparePassword = async function(password){
   return await bcrypt.compare(password,this.password); 
}

//Genetrating password reset token

userSchema.methods.getResetPasswordToken = function(){

    //generating token
    const restToken = crypto.randomBytes(20).toString("hex");

    //hashing and addinf resetpasswordToken to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now + 15 * 60 * 1000;
    return restToken;
}

module.exports = mongooes.model("user",userSchema);

