const express = require("express");
const { authenticator } = require("../middlewares/authenticator");
const jwt = require("jsonwebtoken");
const { QuestModel } = require("../models/QuestModel");
const { membersModel } = require("../models/membersModel");
const { jwtExtractor } = require("../middlewares/jwt");

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
  if (token) {
    const jwtData = await jwtExtractor(token.split(" ")[1]);
    const member = await membersModel.findById(jwtData.id);
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

questRouter.post("/completeTask", async (req, res) => {
  let task = req.body.task;
  let jwt = req.headers.authorization;
  if(!jwt){
   return res.send({
        message: "invalid jwt token",
        status: 0,
        error: true,
      });
  }
  const jwtData = await jwtExtractor(jwt.split(" ")[1]);
  let userId = jwtData.id;
  let questId = req.body.questId;
  let data = await QuestModel.find({ _id: questId });
  let taskIndex = data[0].task.split("|").length;
  let datafromloop;
  for (let index = 0; index < taskIndex; index++) {
    if (task == data[0].task.split("|")[index]) {
      datafromloop = index;
      break;
    }
  }
  if (datafromloop == undefined) {
    return res.json("task not exist");
  }
  // string patcher
  let vir_task = "";
  for (let index = 0; index < taskIndex; index++) {
    if (index == datafromloop && datafromloop == 0) {
      vir_task = vir_task + data[0].task.split("|")[index] + "~completed";
    } else if (index == datafromloop) {
      vir_task = vir_task + "|" + data[0].task.split("|")[index] + "~completed";
    } else if (index >= 1 && index != datafromloop) {
      vir_task = vir_task + "|" + data[0].task.split("|")[index];
    } else {
      vir_task = vir_task + data[0].task.split("|")[index];
    }
  }
  
  const member = await membersModel.findById(userId);
  const taskExists = member.task.some(
    (task) => task.questId.toString() === questId.toString()
  );
  const existingTask = member.task.find(
    (task) => task.questId.toString() === questId.toString()
  );
  
  const taskStatus = existingTask.task.split("|")[datafromloop].split("~");

  if (taskStatus[3] == "completed") {
    return res.json("task already is completed");
  }

  if (taskExists) {
    const updatedMember = await membersModel.findOneAndUpdate(
      { _id: userId, "task.questId": questId },
      {
        $set: { "task.$.task": vir_task },
        $inc: { points: Number(taskStatus[2]) },
      },
      { new: true }
    );
  } else {
    const member = await membersModel.findByIdAndUpdate(
      userId,
      {
        $push: { task: { questId: questId, task: vir_task } },
        $inc: { points: Number(taskStatus[2]) },
      }
    );
  }
  res.send("ok");
});

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
