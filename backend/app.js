const express = require("express");
const app = express();
app.use(express.json());
const errorMiddleware = require("./middlewares/error");
//Route imports
const product = require("./routes/ProductRoute");
app.use("/api/v1", product);

//middleware for errors
app.use(errorMiddleware);

module.exports = app;
