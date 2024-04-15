const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
const userRoute = require("./routes/routes");
app.use(express.json());
mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Connected Successfully");
    
  })
  .catch((error) => {
    console.log(error);
  });
app.listen(3000, () => console.log("server started"))
app.use(userRoute);
