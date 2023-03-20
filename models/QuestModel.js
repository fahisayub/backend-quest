const mongoose = require("mongoose")


const questSchema = mongoose.Schema({
cname:{type:String,required:true},
uid:{type:String,required:true},
cemail:{type:String,required:true},
cimage:{type:String,required:true},
name:{type:String,required:true},
task:{type:String,required:true},
description:{type:String,required:true},
sdate:{type:String,required:true},
edate:{type:String,required:true},
tokens:{type:Number,required:true},
now:{type:Number,required:true},
sub:{type:String,required:true},
},{
    versionKey:false
})


const QuestModel = mongoose.model("/quest",questSchema)

module.exports={
    QuestModel
}