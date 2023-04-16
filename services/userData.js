const { membersModel } = require("../models/membersModel");
const { questJoinedModel } = require("../models/questJoinedModel");

async function updateEmailByWalletAddress(walletAddress, newEmail) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { Email: newEmail } },
      { new: true }
    );
    return updatedMember;
  } catch (error) {
    console.error(error);
  }
}

async function updatePointsByWalletAddress(walletAddress, newPoints) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress: walletAddress },
      { $inc: { points: newPoints } },
      { new: true }
    );
    return "success";
  } catch (error) {
    console.error(error);
  }
}

async function updateBioByWalletAddress(walletAddress, newBio) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { Bio: newBio } },
      { new: true }
    );
    return updatedMember;
  } catch (error) {
    console.error(error);
  }
}

async function updateNameByWalletAddress(walletAddress, newName) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { name: newName } },
      { new: true }
    );
    return updatedMember;
  } catch (error) {
    console.error(error);
  }
}

async function getTaskCompletedData(userId, questId) {
  try {
    const questJoined = await questJoinedModel.findById(userId).populate({
      path: "questsJoined",
      match: { questId },
    });
    if (!questJoined) {
      return "Quest joined data not found";
    }
    const quest = questJoined.questsJoined[0];
    if (!quest) {
      return "Quest not found";
    }
    const taskCompleted = quest.taskCompleted;
    return taskCompleted;
  } catch (error) {
    console.error(error);
  }
}

async function updateTaskCompletedData(userId, questId,task) {
  try {
    console.log(task);
  } catch (error) {
    
  }
}

module.exports = {
  updatePointsByWalletAddress,
  getTaskCompletedData,
  updateTaskCompletedData
};
