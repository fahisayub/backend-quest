const mongoose = require("mongoose");

const questJoinedSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "/members",
    },
    walletAddress: {
      type: String,
      required: true,
    },
    questsJoined: [
      {
        questId: {
          type: mongoose.Types.ObjectId,
          ref:'/quest'
        },
        taskCompleted: [
          {
            taskType: {
              type: String,
              default: null,
            },
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
  }
);

const questJoinedModel = mongoose.model("/questJoined", questJoinedSchema);

module.exports = {
  questJoinedModel,
};
