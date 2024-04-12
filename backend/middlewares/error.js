const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";

    //wrong mongodb id error cast error
    if (err.name === "CastError") {
        const message = `Resource not found. invalid :${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        // message: err.stack,
        message: err.message,
    });
};