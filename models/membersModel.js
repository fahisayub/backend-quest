const mongoose = require("mongoose");

const membersSchema = mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true },
  email: { type: String },
  Bio: { type: String },
  image: { type: String },
  task: [
      {
        questId:{
          type:mongoose.Types.ObjectId,
          ref:"/quest"
        },
        task:{
          type:String
        }
      }
     
  ],
  twitterAuth:{accessKey:{type:String},seceret:{type:String},status:{type:Boolean,default:false}},
  totalq: { type: Number },
  points: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const membersModel = mongoose.model("/members", membersSchema);

module.exports = {
  membersModel,
};
