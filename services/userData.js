const { membersModel } = require("../models/membersModel")

async function updateEmailByWalletAddress(walletAddress, newEmail) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { Email: newEmail } },
      { new: true }
    )
    return updatedMember
  } catch (error) {
    console.error(error)
  }
}

async function updatePointsByWalletAddress(walletAddress, newPoints) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress:walletAddress },
      { $inc: { points: newPoints } },
      { new: true }
    )
    return updatedMember
  } catch (error) {
    console.error(error)
  }
}

async function updateBioByWalletAddress(walletAddress, newBio) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { Bio: newBio } },
      { new: true }
    )
    return updatedMember
  } catch (error) {
    console.error(error)
  }
}

async function updateNameByWalletAddress(walletAddress, newName) {
  try {
    const updatedMember = await membersModel.findOneAndUpdate(
      { walletAddress },
      { $set: { name: newName } },
      { new: true }
    )
    return updatedMember
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
    updatePointsByWalletAddress
}