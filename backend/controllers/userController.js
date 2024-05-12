const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const registerUser=expressAsyncHandler(
    async (req,res)=>{
        console.log(req.body);
        const {name,password,email}= req.body
        if(!name || !email || !password){
            res.status(400);
            throw new Error("Please Enter all fields")
        }
        const userExists= await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error("User already exists")
        }
        const user= await User.create({name,password,email})
        // console.log(user);
        if(user){
            res.status(201).json({
                _id:user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                pic: user.pic,
                token: generateToken(user._id)
            })
        }
        else{
            res.status(400);
            throw new Error("Failed to create user try again...")
        }
    }
)

const loginUser= expressAsyncHandler(
    async (req,res)=>{
        const {email,password}= req.body;
        const user= await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name:user.name,
                email: user.email,
                pic:user.pic,
                token: generateToken(user._id)
            })
        }
        else{
            res.status(400)
            throw new Error("Email or password is invalid")
        }
    }
)

const allUsers= expressAsyncHandler(
    async (req,res)=>{
        const keyword= req.query.search ?{
            $or:[
                {name:{$regex:req.query.search,$options:"i"}},
                {email:{$regex:req.query.search,$options:"i"}}
            ]
        }
        :
        {}
        const users= await User.find(keyword).find({_id:{$ne:req.user._id}})
        res.send(users)
    }
)

module.exports= {registerUser,loginUser,allUsers}