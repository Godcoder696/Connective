const express= require("express")
const dotenv= require("dotenv")
const cors= require("cors")
const connectDB= require("./config/db")
const userRoutes= require("./routes/userRoutes")
const chatRoutes= require("./routes/chatRoutes")
const messageRoutes= require("./routes/messageRoutes")
const { errorhandler, notFound } = require("./middlewares/errorMiddleware")
const path= require("path")

dotenv.config()

const app= express()

app.use(cors())

connectDB()

app.use(express.json())

// ---------------------------- DEPLOYMENT -------------------------------


const _dirName= path.resolve()
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirName,"/frontend/build")))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(_dirName,"frontend","build","index.html"))
    })
}
else{
    app.get("/",(req,res)=>{
        res.send("API running successfully!");
    })
}


// ---------------------------- DEPLOYMENT -------------------------------



app.get("/",(req,res)=>{
    // console.log("API is running!");
    res.send("API is running!")
})

const port= process.env.PORT || 4000

// user routes
app.use("/api/user",userRoutes);

// chat routes
app.use('/api/chat',chatRoutes)

// message routes
app.use('/api/message',messageRoutes)

// listen on port 
const server=app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

// ERROR HANDLING USING MIDDLEWARES
app.use(errorhandler)
app.use(notFound)

const io= require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("Connected with socket.io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        console.log(userData._id);
        socket.emit('connected')
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User Joined Room: ",room);
    })

    socket.on('new message',(msgReceived)=>{
        let chat= msgReceived.chat

        if(!chat.users) return console.log('chat.user not found!');

        console.log(msgReceived);

        chat.users.forEach(user=>{
            if(user._id == msgReceived.sender._id){
                return ;
            }
            socket.in(user._id).emit("message received",msgReceived)
        })
    })
})