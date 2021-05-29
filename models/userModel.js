const mongoose = require("mongoose");

// create user schema
const userSchema = mongoose.Schema({
  username:{
    type: String,
    required: [true, "User must have username"],
    unique: true,
  },
  password:{
    type: String,
    required: [true, "User must have password"],
  }
});

// export User data model (entity) 
const User = mongoose.model("User", userSchema);
module.exports = User;