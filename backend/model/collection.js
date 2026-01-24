const {userSchema,issueSchema,documentSchema,companySchema,roleSchema,chatHistorySchema,teamChatSchema,apiKeySchema,apiKeyUsageSchema}=require("./schema");
const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const User=mongoose.model("User",userSchema);
const Issue=mongoose.model("Issue",issueSchema);
const Document=mongoose.model("Document",documentSchema);
const Company=mongoose.model("Company",companySchema);
const Role=mongoose.model("Role",roleSchema);
const ChatHistory=mongoose.model("ChatHistory",chatHistorySchema);
const TeamChat=mongoose.model("TeamChat",teamChatSchema);
const APIKey=mongoose.model("APIKey",apiKeySchema);
const APIKeyUsage=mongoose.model("APIKeyUsage",apiKeyUsageSchema);

module.exports={User,Company,Document,Issue,Role,ChatHistory,TeamChat,APIKey,APIKeyUsage}