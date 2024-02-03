const ErrorHander = require("../utils/errorhander");
const catchAsynceErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsynceErrors( async(req, res, next)=>{

    const {token} = req.cookies;
   if(!token){
    return next(new ErrorHander("Please login to access this resouces", 401));
   }
   const decodeData = jwt.verify(token,process.env.JWT_SECRET);
   
   req.user = await User.findById(decodeData.id);
   next();

});

exports.authorizeRoles = (...roles) =>{
    return(req,res,next) =>{


        if(!roles.includes(req.user.role)){

            return next (new ErrorHander(`Role ${req.user.role} is not allowed to access this resource`, 403));
        }

        next();
    };
};


