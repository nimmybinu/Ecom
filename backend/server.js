const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
//config
dotenv.config({ path: "backend/config/config.env" });
//db connection
connectDB();
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`);
});
//handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`ERROR ${err.message}`);
    console.log("shutting down the server due to uncaught exception");

    process.exit(1);
});

// console.log(youtube); uncaught error
//unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`ERROR ${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
