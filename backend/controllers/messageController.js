const expressAsyncHandler = require("express-async-handler");
const Message= require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessages= expressAsyncHandler (async (req,res)=>{
    const {chatId,content}= req.body;

    if(!content || !chatId){
        console.log("All contents not send !");
        return res.sendStatus(400)
    }

    let newMessage= {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message= await Message.create(newMessage)

        message= await message.populate("sender","name pic")
        message= await message.populate("chat")
        message= await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })

        res.json(message)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const allMessages= expressAsyncHandler(async (req,res)=>{
    const id = req.params.q
    try {
        const message= await Message.find({
            chat: id,
        })
        .populate("sender","name email pic")
        .populate("chat")

        res.json(message)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports={ sendMessages,allMessages}