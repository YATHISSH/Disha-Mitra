const mongoose=require("mongoose");
const {Issue}=require("../model/collection");
const { recordActivity } = require('../utils/auditLogger');

mongoose.connect(process.env.MONGO_URI);

const registerIssue = async (req, res) => {
    try{
        const {name,mob,type,issuedetails,preferredTime,preferredDate,address,area,by,others}=req.body;
        const newUser=new Issue({name,mob,type,issuedetails,preferredTime,preferredDate,address,area,by,others});
        await newUser.save();
        await recordActivity(req, { action: 'ISSUE_CREATE', resource: '/issue', result: 201, metadata: { type, by } });
        return res.status(201).json({"error":0});
    }
    catch(error){
        console.log("Error at creating issue",error);
        await recordActivity(req, { action: 'ISSUE_CREATE', resource: '/issue', result: 400, metadata: { error: error.message } });
        return res.status(400).json({"error":1});
    }
};

module.exports={registerIssue};