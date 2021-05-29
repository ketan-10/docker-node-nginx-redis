const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// session management
const session = require("express-session");
// redis will store sessions
const redis = require("redis");
// connect expresss to redis
const connectRedis = require("connect-redis");


// config
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET, NODE_PORT } = require("./config/config");

// routes
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

// auth middleware
const protect = require("./middleware/authMiddelware");


/************************************ EXPRESS *************************************/

//init app
const app = express();

// https://stackoverflow.com/questions/23413401/what-does-trust-proxy-actually-do-in-express-js-and-do-i-need-to-use-it
// no need in this app
app.enable("trust proxy") 

// tl;dr
// CORS (cross site resource sharing) 
// In csrf (cross site resource forgory) untrusted site can send post request on its site with good site as location,
// browser will think this req is we are sending to good site, so we should send the cookies
// so if this site posts delete account, and user is logged in browser will send send to good site 
// browser can send the request, but the bad site can not view the response.
// (above will be only true for non-simple-req, which is not ture for new request,
//  https://stackoverflow.com/questions/10636611/how-does-access-control-allow-origin-header-work )
// for new request browser will do round trip.

// but in our case this is the issue in our case, we want to read the response from other sites, 
// so we set cors header to our site
// bowser check for this header, if header is presend 
app.use(cors({}))

// jsonify request
app.use(express.json());


/************************************ REDIS *************************************/
// connect-redis with express-session  
let RedisStore = connectRedis(session)

// init redis db
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
})

// use express-session with redit store -> redisClient
app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 30000,
  }
}))


/************************************ MONGO *************************************/
// connect mongoDB
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// retry mongodb mechanisum 5sec 
const connectMongoWithRetry = () => {

  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(()=>{console.log("connected to mongo")})
  .catch((e)=> {
    console.log(e);
    console.log(mongoUrl);
    setTimeout(connectMongoWithRetry,5000);
  })
  
}

connectMongoWithRetry();

/************************************ ROUTES *************************************/
// home route
app.get("/api/v1", (req,res)=>{
  console.log("container is running");
  res.send("<h2>Hi There!<h2> ")
});

// user router
app.use("/api/v1/users",userRouter);

// posts router
app.use("/api/v1/posts",protect, postRouter);


const port = NODE_PORT;

app.listen(port,()=>{
  console.log(`listning on port ${port}`)
}); 
