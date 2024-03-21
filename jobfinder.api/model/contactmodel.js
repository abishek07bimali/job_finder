const mongoose = require("mongoose");

const Contect=mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    message: {
        type:String,
        required:true
      },
})
 const ContactModel=mongoose.model('contact',Contect);
    module.exports=ContactModel;
