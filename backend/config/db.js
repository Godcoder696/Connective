const mongoose= require("mongoose")

const connectDB=async ()=>{
    try{
        const connect= await mongoose.connect(process.env.URI);
        console.log("MongoDB Connected to: '"+connect.connection.host+"' Successfully");
    }
    catch(error){
        console.log(error);
    }
}

module.exports=connectDB