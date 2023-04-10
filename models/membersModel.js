const mongoose = require("mongoose");

const membersSchema = mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true },
  email: { type: String },
  Bio: { type: String },
  image: { type: String },
  task: [
    {
      taskId: {
         type:Number,
        required: true,
      },
      taskName: {
        type: String,
      },
      taskPoints: {
        type: Number,
        default: 10,
      },
      taskCompleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalq: { type: Number },
  points: { type: Number, default: 00 },
  lastUpdated: { type: Date, default: Date() },
});

const membersModel = mongoose.model("/members", membersSchema);

module.exports = {
  membersModel,
};
