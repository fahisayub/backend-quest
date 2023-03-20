const express = require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.routes")
const cors = require("cors")
const { questRouter } = require("./routes/quest.routes")

const app = express()
app.use(cors())
app.use("/user",userRouter)
app.use(express.json())
app.use("/quest",questRouter)
app.get("/",(req,res)=>{
    res.send({
        message:"API is working fine"
    })



})




app.listen(process.env.PORT,async()=>{
    try {
       await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log("Something went wrong: ",error)
    }
    console.log("Server is running on", process.env.PORT)


})