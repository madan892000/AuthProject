const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password:{
        type:String,
        required:true
    },
    
  },
  { timestamps: true }
);
const User = new mongoose.model("User", userSchema);
module.exports = User;





