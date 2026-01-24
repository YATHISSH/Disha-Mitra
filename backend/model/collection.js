const {userSchema,issueSchema,documentSchema,companySchema,roleSchema}=require("./schema");
const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const User=mongoose.model("User",userSchema);
const Issue=mongoose.model("Issue",issueSchema);
const Document=mongoose.model("Document",documentSchema);
const Company=mongoose.model("Company",companySchema);
const Role=mongoose.model("Role",roleSchema);

module.exports={User,Company,Document,Issue,Role}