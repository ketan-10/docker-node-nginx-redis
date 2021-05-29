const User = require("../models/userModel")

const bcript = require("bcryptjs");



exports.signUp = async (req,res, next)=> {
  try{

      const {username, password} = req.body;
      const hashpassword = await bcript.hash(password, 12);
      
      // create new user with username and password 
      // -> all the validation is done by mongo itself
      const newUser = await User.create({
        username: username,
        password: hashpassword,
      }); 

      req.session.user = newUser;

      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
  }catch(e){
    console.log(e);
     res.status(401).json({
       status: "fail",
     }) 
  }
}



exports.login = async (req,res, next)=> {
  try{
      const {username, password} = req.body;

      // find the user in db
      const user = await User.findOne({username});

      if(!user){
        return res.status(400).json({
          status: "fail",
          message: "user not found",
        });
      }
      // check password
      const isCorrect = await bcript.compare(password, user.password);
      if(!isCorrect){ 
        return res.status(400).json({
          status: "fail",
          message: "incorrect username or password",
        });
      }

      req.session.user = user;
      
      res.status(201).json({
        status: "success",
      });

  }catch(e){
     res.status(401).json({
       status: "fail",
     }) 
  }
}