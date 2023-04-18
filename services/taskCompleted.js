const { jwtExtractor } = require("../middlewares/jwt");
const { membersModel } = require("../models/membersModel");
const taskComplete = async (req, res) => {
    let task = req.body.task;
    let jwt = req.headers.authorization;
    let jwtToken = jwt.split(" ")[1]
    console.log("jwt token ",jwtToken.length)
    if (jwtToken.length==9) {
      return res.send({
        message: "invalid jwt token",
        status: 0,
        error: true,
      });
    }
    console.log(jwt);
    const jwtData = await jwtExtractor(jwtToken);
    console.log("jwt decode data",jwtData)
    let userId = jwtData.id;
    let questId = req.body.questId;
    console.log(req.body);
    let data = await QuestModel.find({ _id: questId });
    console.log(data);
    console.log("ye task hai",task)
    let taskData = task.split("~");
    let taskIndex = data[0].task.split("|").length;
    let datafromloop;
    for (let index = 0; index < taskIndex; index++) {
      if (task == data[0].task.split("|")[index]) {
        console.log(data[0].task.split("|")[index]);
        datafromloop = index;
        break;
      }
    }
    
    if (datafromloop == undefined) {
      console.log("data comming is undefines")
      return res.json("task not exist");
    }
    console.log("testing phase 1", datafromloop)
  
    // string patcher
  
    // console.log("virtual task", vir_task);
    const member = await membersModel.findById(userId);
    const taskExists = member.task.some(
      (task) => task.questId.toString() === questId.toString()
    );
    let existingTask;
    var vir_task = "";
    if (taskExists) {
      existingTask = member.task.find(
        (task) => task.questId.toString() === questId.toString()
      );
      for (let index = 0; index < taskIndex; index++) {
        if (index == datafromloop && datafromloop == 0) {
          vir_task =
            vir_task + existingTask.task.split("|")[index] + "~completed";
        } else if (index == datafromloop) {
          vir_task =
            vir_task + "|" + existingTask.task.split("|")[index] + "~completed";
        } else if (index >= 1 && index != datafromloop) {
          vir_task = vir_task + "|" + existingTask.task.split("|")[index];
        } else {
          vir_task = vir_task + existingTask.task.split("|")[index];
        }
      }
      const taskStatus = existingTask.task.split("|")[datafromloop].split("~");
      console.log("virtask to update",vir_task)
      console.log("existing task", existingTask);
  
      if (taskStatus[3] == "completed") {
        return res.json("task already is completed");
      }
    }else{
      console.log("testing phase 2")
      for (let index = 0; index < taskIndex; index++) {
        if (index == datafromloop && datafromloop == 0) {
          vir_task =
            vir_task + data[0].task.split("|")[index] + "~completed";
        } else if (index == datafromloop) {
          vir_task =
            vir_task + "|" + data[0].task.split("|")[index] + "~completed";
        } else if (index >= 1 && index != datafromloop) {
          vir_task = vir_task + "|" + data[0].task.split("|")[index];
        } else {
          vir_task = vir_task + data[0].task.split("|")[index];
        }
      }
    }
    
  
    if (taskExists) {
      const updatedMember = await membersModel.findOneAndUpdate(
        { _id: userId, "task.questId": questId },
        {
          $set: { "task.$.task": vir_task },
          $inc: { points: Number(taskData[2]) },
        },
        { new: true }
      );
    } else {
      const member = await membersModel.findByIdAndUpdate(userId, {
        $push: { task: { questId: questId, task: vir_task } },
        $inc: { points: Number(taskData[2]) },
      });
    }
    console.log("all done");
    const obj = {
      task:task+"~"+"completed"
    }
    res.json(obj);
  }

  module.exports ={
    taskComplete
  }