const express = require("express");
const { authenticator } = require("../middlewares/authenticator");
const jwt = require("jsonwebtoken");
const { QuestModel } = require("../models/QuestModel");
const { membersModel } = require("../models/membersModel");
const { jwtExtractor } = require("../middlewares/jwt");
const { taskComplete } = require("../services/taskCompleted");

const questRouter = express.Router();
questRouter.post("/create", (req, res) => {
  let {
    cname,
    cemail,
    name,
    cimage,
    description,
    edate,
    sdate,
    task,
    tokens,
    now,
    sub,
  } = req.body;
  jwt.verify(
    req.headers.authorization,
    process.env.SecretKey,
    async (err, decoded) => {
      if (err)
        res.send({
          message: "Something went wrong: " + err,
          status: 0,
          error: true,
        });

      if (decoded) {
        try {
          let quest = new QuestModel({
            uid: decoded.userId,
            cname,
            cemail,
            name,
            cimage,
            description,
            edate,
            sdate,
            task,
            tokens,
            now,
            sub,
          });
          await quest.save();
          res.send({
            message: "Quest Created",
            status: 1,
            error: false,
          });
        } catch (error) {
          res.send({
            message: "Something went wrong: " + error,
            status: 0,
            error: true,
          });
        }
      } else {
        res.send({
          message: "Something went wrong: Invalid token",
          status: 0,
          error: true,
        });
      }
    }
  );
});

questRouter.get("/allquest", async (req, res) => {
  try {
    let data = await QuestModel.find({});
    res.send({
      message: "Quest data",
      status: 1,
      data: data,
      error: false,
    });
  } catch (error) {
    res.send({
      message: "Something went wrong: " + error.message,
      status: 0,
      error: true,
    });
  }
});

questRouter.get("/:id", async (req, res) => {
  let data = await QuestModel.find({ _id: req.params.id });
  const questId = req.params.id;
  const token = req.headers.authorization;
  const jwt = token.split(" ")[1];
   console.log("jwt token",jwt)
  if (jwt.length > 12) {
    console.log("error in jwt");
    const jwtData = await jwtExtractor(jwt);
    console.log("jwt data 102",jwtData)
    const member = await membersModel.findById(jwtData.id);
    console.log(member)
    const taskExists = member.task.some(
      (task) => task.questId.toString() === questId.toString()
    );
    if (taskExists) {
      const existingTask = member.task.find(
        (task) => task.questId.toString() === questId.toString()
      );
      console.log(existingTask);
      return res.send({
        message: "Quest data",
        status: 1,
        data: data[0],
        task: existingTask.task,
        error: false,
      });
    }
  }
  if (data.length > 0) {
    res.send({
      message: "Quest data",
      status: 1,
      data: data[0],
      task: data[0].task,
      error: false,
    });
  } else {
    res.send({
      message: "Quest data not found",
      status: 0,
      error: true,
    });
  }
});

questRouter.post("/completeTask",taskComplete);

questRouter.use(authenticator);
questRouter.get("/", (req, res) => {
  jwt.verify(
    req.headers.authorization,
    process.env.SecretKey,
    async (err, decoded) => {
      if (err)
        res.send({
          message: "Something went wrong: " + err,
          status: 0,
          error: true,
        });

      if (decoded) {
        try {
          let data = await QuestModel.find({ uid: decoded.userId });
          res.send({
            message: "Quest data",
            status: 1,
            data: data,
            error: false,
          });
        } catch (error) {
          res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
          });
        }
      } else {
        res.send({
          message: "Something went wrong: Invalid token",
          status: 0,
          error: true,
        });
      }
    }
  );
});

questRouter.patch("/:id", (req, res) => {
  jwt.verify(
    req.headers.authorization,
    process.env.SecretKey,
    async (err, decoded) => {
      if (err)
        res.send({
          message: "Something went wrong: " + err,
          status: 0,
          error: true,
        });

      if (decoded) {
        try {
          await QuestModel.updateOne(
            { uid: decoded.userId, _id: req.params.id },
            req.body
          );
          res.send({
            message: "updated data",
            status: 1,
            error: false,
          });
        } catch (error) {
          res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
          });
        }
      } else {
        res.send({
          message: "Something went wrong: Invalid token",
          status: 0,
          error: true,
        });
      }
    }
  );
});

questRouter.delete("/:id", (req, res) => {
  jwt.verify(
    req.headers.authorization,
    process.env.SecretKey,
    async (err, decoded) => {
      if (err)
        res.send({
          message: "Something went wrong: " + err,
          status: 0,
          error: true,
        });

      if (decoded) {
        try {
          await QuestModel.deleteOne({
            uid: decoded.userId,
            _id: req.params.id,
          });
          res.send({
            message: "deleted data",
            status: 1,
            error: false,
          });
        } catch (error) {
          res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
          });
        }
      } else {
        res.send({
          message: "Something went wrong: Invalid token",
          status: 0,
          error: true,
        });
      }
    }
  );
});

module.exports = {
  questRouter,
};
