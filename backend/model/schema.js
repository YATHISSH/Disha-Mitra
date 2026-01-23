const mongoose=require("mongoose");
const { type } = require("os");
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI);

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
});

const issueSchema=mongoose.Schema({
    name:{type:String,required:true} ,
 mob: {type:String,required:true},
 type: {type:String,required:true},
 issuedetails: {type:String,required:true},
 "preferredTime": {type:String,required:true},
 "preferredDate": {type:String,required:true},
 "address": {type:String,required:true},
 "area": {type:String,required:true},
 "by": {type:String,required:true},
 "others": {type:String,required:true},
})

const documentSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    url: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    uploadedBy: { type: String },
    uploadDate: { type: Date, default: Date.now },
    status: { type: String, default: 'active', enum: ['active', 'archived'] }
});

module.exports={userSchema,issueSchema,documentSchema}