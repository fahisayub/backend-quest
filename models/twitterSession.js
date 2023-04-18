const mongoose = require("mongoose");

const twitter = mongoose.Schema({
    _id:{type:String},
    jwt:{type:String},
    tokenSecret:{type:String},
    token:{type:String}
});

const twitterAuth = mongoose.model("/twitterSessions", twitter);

module.exports = {
  twitterAuth,
};
