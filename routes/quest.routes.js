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
//   const token = req.headers.authorization;
  const jwtData = await jwtExtractor("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIweDBlMTcwRTdFZmUxNDU4ZmU5MDQ5QUNlQzhCNDQzM2I3OWEwQTdEQkIiLCJpYXQiOjE2ODE3NDE3ODB9.iMCS6eOKITGRJ7GWPV9_yKkrCXa5sR4VjPcNcLjaET0")
  console.log(jwtData);
//   if (token) {
//     const member = await membersModel.findById(userId);
//     const taskExists = member.task.some(
//       (task) => task.questId.toString() === questId.toString()
//     );
//     if (taskExists) {
//       const existingTask = member.task.find(
//         (task) => task.questId.toString() === questId.toString()
//       );
//       console.log(existingTask);
//       res.send({
//         message: "Quest data",
//         status: 1,
//         data: data[0],
//         task:existingTask,
//         error: false,
//       });
//     }
//   }
  if (data.length > 0) {
    res.send({
      message: "Quest data",
      status: 1,
      data: data[0],
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
  // let jwt = req.body.task;
  let userId = req.body.userId;
  let questId = req.body.questId;
  let data = await QuestModel.find({ _id: questId });
  let taskIndex = data[0].task.split("|").length;
  let taskdb = data[0].task.split("|");
  console.log(taskIndex);
  console.log(taskdb);
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

  let questTask = data[0].task.split("|")[datafromloop];
  let questPoint = questTask.split("~")[2];
  console.log(questPoint, "quest point");
  let task_to_update;
  console.log("data in loop", datafromloop);
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
  console.log(vir_task, "task to update");
  const member = await membersModel.findById(userId);
  const taskExists = member.task.some(
    (task) => task.questId.toString() === questId.toString()
  );
  const existingTask = member.task.find(
    (task) => task.questId.toString() === questId.toString()
  );
  console.log(existingTask); //

  //   if (taskExists) {
  //     const updatedMember = await membersModel.findOneAndUpdate(
  //       { _id: userId, "task.questId": questId },
  //       { $set: { "task.$.task": vir_task }, $inc: { points: 222 } },
  //       { new: true }
  //     );
  //   } else {
  //     const member = await membersModel.findByIdAndUpdate(
  //       userId,
  //       {
  //         $push: { task: { questId: questId, task: task_to_update } },
  //         $inc: { points: 222 },
  //       } // Update object

  //       // Options object
  //     );
  //   }
  // task updation function complete here
  //

  //    console.log("data from loop",datafromloop);
  //    console.log(data[0].task.split("~")[2]);
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
