const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const accessChat= expressAsyncHandler(
    async(req,res)=>{
        const {userId}= req.body;

        if(!userId){
            console.log("Params was not send!");
            return res.sendStatus(400);
        }

        let isChat= await Chat.find({
            isGroupChat:false,
            $and:[
                {
                    users: {$elemMatch:{$eq:req.user._id}}
                },
                {
                    users: {$elemMatch:{$eq:req.userId}}
                }
            ]
        }).populate("users","-password").populate("latestMessage")

        isChat= await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"name pic email"
        })

        if(isChat.length>0){
            res.send(isChat[0])
        }
        else{
            let chatData={
                chatName:"sender",
                isGroupChat:false,
                users: [req.user._id,userId]
            }

            try {
                const createdChat= await Chat.create(chatData);

                const fullChat= await Chat.findOne({_id:createdChat._id}).populate("users","-password")

                res.status(200).send(fullChat);

            } catch (error) {
                res.status(400)
                throw new Error(error.message)
            }
        }
    }
)

const fetchChats= expressAsyncHandler(
    async (req,res)=>{
        try {
            let result = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updatedAt:-1})

            result = await User.populate(result,{
                path:"latestMessage.sender",
                select:"name pic email"
            })

            res.send(result)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
)

const groupChat= expressAsyncHandler(
    async (req,res)=>{
        if(!req.body.users || !req.body.name){
            return res.status(400).send({message:"Please fill all the details!"})
        }

        let users= JSON.parse(req.body.users)

        if(users.length<2){
            return res.status(400).send("More than 2 users are required to form a group chat!")
        }

        users.push(req.user);

        try {
            const groupChat= await Chat.create({
                chatName: req.body.name,
                users:users,
                isGroupChat:true,
                groupAdmin: req.user
            })

            const fullGroupChat= await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password")

            res.status(200).json(fullGroupChat)

        } catch (error) {
            return res.status(400).send(error.message)
        }
    }
)

const renameGroup= expressAsyncHandler(
    async (req,res)=>{
        const {chatId, chatName}= req.body;

        const updatedChat= await Chat.findByIdAndUpdate(
            {
                _id:chatId
            },
            {
                chatName:chatName
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!updatedChat){
            res.status(404)
            throw new Error("Chat Not Found")
        }
        else{
            res.status(200).send(updatedChat)
        }
    }
)

const addToGroup= expressAsyncHandler(
    async (req,res)=>{
        const {groupId,userId}= req.body;

        const added= await Chat.findByIdAndUpdate(
            groupId,
            {
                $push:{users:userId}
            },
            {
                new: true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!added){
            res.status(400)
            throw new Error("Chat Not Found!")
        }
        else{
            res.status(200).send(added)
        }
    }
)

const removeFromGroup= expressAsyncHandler(
    async (req,res)=>{
        const {userId,groupId}= req.body

        const removed= await Chat.findByIdAndUpdate(
            groupId,
            {
                $pull:{users:userId}
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!removed){
           res.status(400) 
           throw new Error("Chat Not Found!")
        }
        else{
            res.status(200).send(removed)
        }
    }
)

module.exports= {accessChat,fetchChats,groupChat,renameGroup,addToGroup,removeFromGroup}