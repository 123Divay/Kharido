const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
// Handling uncaught exception
process.on("uncaughtException",(err)=>{
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
});

dotenv.config({path:"Backend/config/config.env"});
connectDatabase();

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT,() => {
  console.log(`Server is running on port : ${process.env.PORT}`);
});
// Unhandled Promise Rejections
process.on("unhandledRejection",(err)=>{
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(()=>{
    process.exit(1);
  });
});
