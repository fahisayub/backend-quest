const { membersModel } = require("../models/membersModel");
const { metamaskValidator } = require("../services/metamaskWalletValidator");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { updatePointsByWalletAddress } = require("../services/userData");
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
        { userId: data[0]._id, role: data[0].role },
        process.env.SecretKey
      );
      res.send({
        message: "Login successful",
        status: 1,
        name: data[0].name,
        email: data[0].email,
        image: data[0].image,
        points: data[0].points,
        token: token,
        error: false,
      });
    } else {
      try {
        let user = new membersModel({
          walletAddress: address,
          name: address,
          task : [{taskName:"DicordAuth",taskPoints:100,taskId:1}],
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
const addPointToUser = async (req,res)=> {
  const token = req.headers.authorization;
  const point = req.body.point;
  const address = req.body.address;
  const response = updatePointsByWalletAddress(address,point)
  res.json(response);
}

module.exports = {
  metamaskAuth,
  addPointToUser
};
