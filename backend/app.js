const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
const errorMiddleware = require("./middlewares/error");
//Route imports
const product = require("./routes/ProductRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//middleware for errors
app.use(errorMiddleware);

module.exports = app;
