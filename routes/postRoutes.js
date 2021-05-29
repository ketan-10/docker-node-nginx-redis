const express = require("express");


const { getAllPosts, createPost, getOnePost, updatePost, deletePost } = require("../controller/postController");

const router = express.Router();



router
  .route("/")
  .get(getAllPosts)
  .post(createPost);

router
  .route("/:id")
  .get(getOnePost)
  .patch(updatePost)
  .delete(deletePost);


module.exports = router;