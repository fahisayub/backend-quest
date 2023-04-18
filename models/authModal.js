const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
 userId: {type:mongoose.Types.ObjectId,ref:"members"},
  walletAddress: { type: String, required: true },
  discordAuth: {
    userId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    guilds: [String]
  },
 
    twitterId: {
      type: String,
    },
    twitterOauthToken:{
       type:String
    },
    twitterOauthSecret:{
       type:String
    },
    token: {
      type: String,
    },
    tokenSecret: {
      type: String,
    },
  
  lastUpdated: { type: Date, default: Date() },
});

const authModel = mongoose.model("/members", authSchema);

module.exports = {
  authModel,
};
