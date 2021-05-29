const mongoose = require("mongoose");


const postSchema = mongoose.Schema({
  title:{
    type: String,
    required: [true, "Post must have Title"]
  },
  body:{
    type: String,
    required: [true, "Post must have body"]
  }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;