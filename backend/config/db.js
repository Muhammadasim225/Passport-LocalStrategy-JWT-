const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
const conn=mongoose.connect(process.env.CONN).then(()=>{
    console.log("Successfully connected");

}).catch((err)=>{
    console.log("Error try again" , err);
});


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }

})
const userModal= new mongoose.model('userModal',userSchema);
module.exports={
    conn,userModal
};

