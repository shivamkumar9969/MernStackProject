const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail.js")

//Ragister user


exports.registerUser = catchAsyncError(async (req,res,next)=>{

    const {name,email,password} = req.body;
    
    const user = await User.create({
        name,email,password,
        avtar:{
            public_id:"this is the public id",
            url:"profilepicurl",
        },

    });

    sendToken(user,201,res);
})


//login user

exports.loginUser = catchAsyncError( async (req,res,next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHander("Please  Enter Email & Password", 400));
    } 

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched ){
        return next(new ErrorHander("Invalid email or password", 401));
    }

   sendToken(user,200,res);
    
});



//logout user

exports.logout = catchAsyncError(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date (Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"logged Out",
    });
})


//Forgot Password 

exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHander("User Not Found!", 404));
    }

    //Get ResetPassword token
    const restToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${restToken}`;

    const message = ` Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it `;

    try{

       await sendEmail({
        email:user.email,
        subject:`Eeomerece password recovery`,
        message,
       });

       res.status(200).json({
        success:true,
        message: `Email sent to ${user.email} succcessfully`,
       })



       
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next (new ErrorHander(error.message,500))
    }



})