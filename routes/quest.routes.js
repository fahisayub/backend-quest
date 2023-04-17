const express = require("express")
const { authenticator } = require("../middlewares/authenticator")
const jwt = require("jsonwebtoken")
const { QuestModel } = require("../models/QuestModel")
const { membersModel } = require("../models/membersModel")

const questRouter = express.Router()
questRouter.post("/create",(req,res)=>{

    let {cname,cemail,name,cimage,description,edate,sdate,task,tokens,now,sub} = req.body
    jwt.verify(req.headers.authorization, process.env.SecretKey,async(err,decoded)=>{
        if(err) res.send({
            message:"Something went wrong: "+err,
            status:0,
            error:true
        })

        if(decoded){

            try {
                let quest = new QuestModel({uid:decoded.userId,cname,cemail,name,cimage,description,edate,sdate,task,tokens,now,sub})
                await quest.save()
                res.send({
                    message:"Quest Created",
                    status:1,
                    error:false
                })
                
            } catch (error) {
                res.send({
                    message:"Something went wrong: "+error,
                    status:0,
                    error:true
                })
                
            }

        }else{
            res.send({
                message:"Something went wrong: Invalid token",
                status:0,
                error:true
            })
        }
    })

})


questRouter.get("/allquest",async(req,res)=>{
    try {
                
        let data = await QuestModel.find({})
        res.send({
            message:"Quest data",
            status:1,
            data:data,
            error:false
        })
    } catch (error) {
        res.send({
            message:"Something went wrong: "+error.message,
            status:0,
            error:true
        })
       
    }


})



questRouter.get("/:id",async(req,res)=>{
    let data = await QuestModel.find({_id:req.params.id})
    if(data.length>0){
        res.send({
            message:"Quest data",
            status:1,
            data:data[0],
            error:false
        })
    }else{
        res.send({
            message:"Quest data not found",
            status:0,
            error:true
        })
    }


})
questRouter.post("/completeTask",async(req,res)=>{
    let task = req.body.task;
    let jwt = req.body.task;
    let userId = req.body.task;
    let questId = req.body.questId;
    console.log(questId,"quest id")
    // let member = membersModel.findById(userId);
//    member.task.push({questId,task})
    let data = await QuestModel.find({_id:questId})
    console.log("quest data",data);
    let taskIndex = data[0].task.split('|').length
    let datafromloop;
   for (let index = 0; index < taskIndex; index++) {
    if (task == data[0].task.split('|')[index]) {
        datafromloop = index;
        break
    }
   }
   let questTask = data[0].task.split('|')[datafromloop];
   let member = membersModel.findById(userId);
   member.task({questId:questId,task})
  member({ $inc: { points: Number(questTask.split("~")[2]) }})
member.save();
   console.log("data from loop",datafromloop);
   console.log(data[0].task.split("~")[2]);
   res.send("ok")


})

questRouter.use(authenticator)
questRouter.get("/",(req,res)=>{

    jwt.verify(req.headers.authorization, process.env.SecretKey,async(err,decoded)=>{
        if(err) res.send({
            message:"Something went wrong: "+err,
            status:0,
            error:true
        })

        if(decoded){

            try {
                
                let data = await QuestModel.find({uid:decoded.userId})
                res.send({
                    message:"Quest data",
                    status:1,
                    data:data,
                    error:false
                })
            } catch (error) {
                res.send({
                    message:"Something went wrong: "+error.message,
                    status:0,
                    error:true
                })
               
            }

        }else{
            res.send({
                message:"Something went wrong: Invalid token",
                status:0,
                error:true
            })
        }
    })


})



questRouter.patch("/:id",(req,res)=>{

    jwt.verify(req.headers.authorization, process.env.SecretKey,async(err,decoded)=>{
        if(err) res.send({
            message:"Something went wrong: "+err,
            status:0,
            error:true
        })

        if(decoded){

            try {
                
                await QuestModel.updateOne({uid:decoded.userId,_id:req.params.id},req.body)
                res.send({
                    message:"updated data",
                    status:1,
                    error:false
                })
            } catch (error) {
                res.send({
                    message:"Something went wrong: "+error.message,
                    status:0,
                    error:true
                })
               
            }

        }else{
            res.send({
                message:"Something went wrong: Invalid token",
                status:0,
                error:true
            })
        }
    })


})



questRouter.delete("/:id",(req,res)=>{

    jwt.verify(req.headers.authorization, process.env.SecretKey,async(err,decoded)=>{
        if(err) res.send({
            message:"Something went wrong: "+err,
            status:0,
            error:true
        })

        if(decoded){

            try {
                
                await QuestModel.deleteOne({uid:decoded.userId,_id:req.params.id})
                res.send({
                    message:"deleted data",
                    status:1,
                    error:false
                })
            } catch (error) {
                res.send({
                    message:"Something went wrong: "+error.message,
                    status:0,
                    error:true
                })
               
            }

        }else{
            res.send({
                message:"Something went wrong: Invalid token",
                status:0,
                error:true
            })
        }
    })


})

module.exports ={
    questRouter
}