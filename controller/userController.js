const { membersModel } = require("../models/membersModel");
const { metamaskValidator } = require("../services/metamaskWalletValidator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { updatePointsByWalletAddress, getTaskCompletedData , updateTaskCompletedData} = require("../services/userData");
const { response } = require("express");
const metamaskAuth = async (req, res) => {
  try {
    const sign = req.body.signature;
    const message = req.body.message;
    const address = req.body.address;
    const t = await metamaskValidator(message, sign, address);
    if (t.error) {
      return res.json("invalid user");
    }
    let data = await membersModel.find({ walletAddress: address });
    if (data.length > 0) {
      const token = jwt.sign(
        { userId: address},
        process.env.SecretKey,
      );
      res.send({
        message: "Login successful",
        status: 1,
        name: data[0].name,
        email: data[0].email,
        image: data[0].image,
        userId: data[0]._id,
        points: data[0].points,
        token: token,
        error: false,
      });
    } else {
      try {
        let user = new membersModel({
          walletAddress: address,
          name: address,
          task : [{questId:"64198cb95d3c955c46d7e4dc",task:"sfu"}],
          points: 10,
        });
        await user.save();
        const token = jwt.sign({ userId: 1 }, process.env.SecretKey);
        res.send({
          message: "Login successful",
          status: 1,
          name: address,
          email: null,
          image: null,
          points: 10,
          token: token,
          error: false,
        });
      } catch (error) {
        console.log(error);
        res.send({
          message: "Something Went Wrong",
          status: 1,
          error: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getUserQuestData = async (req,res) => {
  const questId = req.query.questId;
  const userId = req.query.userId;
  const response = await getTaskCompletedData(userId,questId);
  res.status(200).json(response);
}

const updateUserQuestData = async (req,res) => {
  const questId = req.body.questId;
  const userId = req.body.userId;
  const task = req.body.task;
  const response = await updateTaskCompletedData(userId,questId);
  res.status(200).json(response);
}

const addPointToUser = async (req,res)=> {
  const token = req.headers.authorization;
  const point = req.body.point;
  const address = req.body.address;
  const response = await updatePointsByWalletAddress(address,point)
  console.log("res",response)
  res.status(200).json(response);
}



module.exports = {
  metamaskAuth,
  addPointToUser,
  getUserQuestData,
  updateUserQuestData
};
