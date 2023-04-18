const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const OAuth = require("oauth-1.0a");
const CryptoJS = require("crypto-js");
const { UserModel } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { authenticator } = require("../middlewares/authenticator");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const sharp = require("sharp");
const user = require("../controller/userController");
const path = require("path");
const fs = require("fs");
const { testFn } = require("../services/metamaskWalletValidator");
const { membersModel } = require("../models/membersModel");
const session = require("express-session");
const { twitterAuth } = require("../models/twitterSession");
const { user_twitter_access_key } = require("../services/twitterValidator");
const { getLetestRetweet, getFollowerList } = require("../services/twitterRetweetValidator");
const { jwtExtractor } = require("../middlewares/jwt");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

userRouter.use(express.json());
userRouter.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
userRouter.get("/test", testFn);
userRouter.post("/metamaskAuth", user.metamaskAuth);
userRouter.post("/addPoint", user.addPointToUser);
userRouter.post("/updateQuest", user.updateUserQuestData);
userRouter.get("/questData", user.getUserQuestData);
const API_KEY = "WZZYZu6tMUSQIEKkdp8YFWRCU";
const API_SECRET_KEY = "94ExcdyHLBYg7h2iKEhcxtB5XDYo3oGasCjCUm5v1n80YRnfUm";

const oauth = OAuth({
  consumer: {
    key: API_KEY,
    secret: API_SECRET_KEY,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (base_string, key) => {
    const signature = CryptoJS.HmacSHA1(base_string, key).toString(
      CryptoJS.enc.Base64
    );
    return signature;
  },
});

userRouter.get("/addTwitterAuth", async (req, res) => {
  const previousData = await twitterAuth.findById(req.query.oauth_token);
  console.log(previousData);
  const userData = await user_twitter_access_key(previousData.token,previousData.tokenSecret,req.query.oauth_verifier);
  const retweets = await getLetestRetweet(userData.accessToken,userData.accessTokenSecret);
  console.log(userData);
  const userId = await jwtExtractor(previousData.jwt);
  console.log("user jwt data",userId)
  const updateKey = await membersModel.findByIdAndUpdate(userId.id,{$set:{twitterAuth:{accessKey:userData.accessToken,seceret:userData.accessTokenSecret,status:true}}});
  console.log(updateKey);
  console.log("working");
  console.log(req.query);
  console.log("latest tweets",retweets)
  res.redirect("http://localhost:3000/callback");
});

userRouter.get("/leaderboard", async (req, res) => {
  try {
    const members = await membersModel.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
          points: 1,
        },
      },
      {
        $sort: {
          points: -1,
        },
      },
    ]);

    const leaderboard = members.map((member, index) => ({
      ...member,
      index: index + 1,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.get("/twitter/:jwt", async (req, res) => {
  console.log(req.params.jwt);
  const jwtData = await jwtExtractor(req.params.jwt);
  console.log("jwt data",jwtData)
  const user  = await membersModel.findById(jwtData.id);
  console.log("user data",user);
  if(user.twitterAuth.status){
    const t = await getFollowerList(user.twitterAuth.accessKey,user.twitterAuth.seceret);
    console.log(t,"followers");
  }
  console.log("second line called");
  try {
    const request_data = {
      url: "https://api.twitter.com/oauth/request_token",
      method: "POST",
    };
    const headers = oauth.toHeader(oauth.authorize(request_data));
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    });

    const text = await response.text();
    const token = text
      .split("&")
      .find((str) => str.startsWith("oauth_token="))
      .split("=")[1];
    const token_secret = text
      .split("&")
      .find((str) => str.startsWith("oauth_token_secret="))
      .split("=")[1];
    console.log("user requested data", token, token_secret);
    const obj = new twitterAuth({
      _id: token,
      jwt: req.params.jwt,
      tokenSecret: token_secret,
      token: token,
    });
    obj.save();
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.post("/register", upload.single("image"), async (req, res) => {
  const { email, password, image, role, totalq, points, name, contact } =
    req.body;

  try {
    let data = await UserModel.find({ email });
    if (data.length > 0) {
      res.send({
        message: "User already exist",
        status: 0,
        error: true,
      });
    } else {
      console.log(req.body);
      req.body.role = "user";

      const { filename: imageurl } = req.file;
      await sharp(req.file.path)
        .resize(500)
        .jpeg({ quality: 100 })
        .toFile(path.resolve(req.file.destination + imageurl + ".jpg"));
      fs.unlinkSync(req.file.path);

      // Configure Cloudinary with your API credentials
      cloudinary.config({
        cloud_name: "da7v7atvz",
        api_key: "227593699697124",
        api_secret: "woB6auIuYnn2eJp8P9edd9cWsO0",
      });

      // Upload an image to Cloudinary
      cloudinary.uploader.upload(
        req.file.path + ".jpg",
        { folder: "winter" },
        (err, result) => {
          if (err) {
            console.error(err);
            fs.unlinkSync(req.file.path + ".jpg");
            res.send({
              message: err,
            });
          } else {
            fs.unlinkSync(req.file.path + ".jpg");
            console.log(result.secure_url);
            bcrypt.hash(password, 5, async (err, hash) => {
              if (err)
                res.send({
                  message: "Something went wrong: " + err,
                  status: 0,
                  error: true,
                });

              try {
                let user = new UserModel({
                  email,
                  name,
                  role: "user",
                  password: hash,
                  contact,
                  image: result.secure_url,
                  totalq,
                  points,
                });
                await user.save();

                res.send({
                  message: "User is regsitered",
                  status: 1,
                  error: false,
                });
              } catch (error) {
                fs.unlinkSync(req.file.path + ".jpg");

                res.send({
                  message: "Somthing went wrong" + error.message,
                  status: 0,
                  error: true,
                });
              }
            });
          }
        }
      );
    }
  } catch (error) {
    fs.unlinkSync(req.file.path + ".jpg");
    res.send({
      message: "Somthing went wrong" + error.message,
      status: 0,
      error: true,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log("109", req.body);
  try {
    let data = await UserModel.find({ email });
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (err, result) => {
        if (err)
          res.send({
            message: "Something went wrong",
            status: 0,
            error: true,
          });

        if (result) {
          let token = jwt.sign(
            { userId: data[0]._id, role: data[0].role },
            process.env.SecretKey
          );
          res.send({
            message: "Login successful",
            status: 1,
            name: data[0].name,
            email: data[0].email,
            image: data[0].image,
            token: token,
            error: false,
          });
        } else {
          res.send({
            message: "Password is incorrect",
            status: 0,
            error: true,
          });
        }
      });
    } else {
      res.send({
        message: "User does not exist , Please Sign up",
        status: 0,
        error: true,
      });
    }
  } catch (error) {
    res.send({
      message: "Something went wrong: " + error.message,
      status: 0,
      error: true,
    });
  }
});

// userRouter.get("/getuser",authenticator,async(req,res)=>{
//   let token = req.headers.authorization
//   jwt.verify(token,process.env.SecretKey,async(err,decoded)=>{

//     if(err) res.send({
//       message:"Invalid token",
//       status:0,
//       error:true
//     })

//     if(decoded){
//       let {userId,role}=decoded
//       try {
//         if(role=="admin"||role=="superadmin"){
//           let data = await UserModel.find({_id:userId})
//           res.send({
//             message:"Admin panel approved",
//             role:role,
//             userId:userId,
//             name:data[0].name,
//             status:1,
//             error:false
//           })
//         }else{
//           res.send({
//             message:"Restricted Area",
//             status:0,
//             error:true
//           })
//         }
//       } catch (error) {
//         res.send({
//           message:"Something went wrong: "+error.message,
//           status:0,
//           error:true
//         })

//       }

//     }else{
//       res.send({
//         message:"Invalid token",
//         status:0,
//         error:true
//       })
//     }

//   })

// })

module.exports = {
  userRouter,
};
