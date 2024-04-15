const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample id",
            url: "sample url",
        },
    });
    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success: true,
    //     token,
    // });
    sendToken(user, 200, res);
});
//login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Enter email & password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid  email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid  email or password", 401));
    }
    sendToken(user, 200, res);
});
//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "logged out",
    });
});
//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }
    //get resetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `your password reset token url  is : \n\n ${resetPasswordUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "password recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `email send to ${user.email} succesfully`,
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(err.message, 500));
    }
});
//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //token hash
    console.log(req.params.token);
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    console.log(resetPasswordToken);
    if (!user) {
        return next(new ErrorHandler("reset token is invalid or expired", 400));
    }
    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler("password mismatch", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});
