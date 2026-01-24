const mongoose=require("mongoose");
const { type } = require("os");
const { getNextId } = require('./counter');
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI);

const userSchema=mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    company_id:{type:Number},
    is_active:{type:Boolean,default:true},
});

// Pre-save hook for User
userSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('User');
    }
    next();
});

const issueSchema=mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
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
});

// Pre-save hook for Issue
issueSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('Issue');
    }
    next();
});

const documentSchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
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

// Pre-save hook for Document
documentSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('Document');
    }
    next();
});

const companySchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    companyName: { type: String, required: true },
    industryType: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true },
    companyAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    employees: { type: Number, default: 0 },
    website: { type: String },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] }
});

// Pre-save hook for Company
companySchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('Company');
    }
    next();
});

const roleSchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    company_id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    permissions: { type: [String], default: [] },
    color: { type: String, default: 'blue' },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for Role
roleSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('Role');
    }
    next();
});

const chatHistorySchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    company_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Pre-save hook for ChatHistory
chatHistorySchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('ChatHistory');
    }
    next();
});

const teamChatSchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    company_id: { type: Number, required: true },
    // sender
    user_id: { type: Number, required: true },
    user_name: { type: String, required: true },
    // optional recipient for private chats
    to_user_id: { type: Number },
    to_user_name: { type: String },
    // category: team or private
    category: { type: String, enum: ['team', 'private'], default: 'team' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Pre-save hook for TeamChat
teamChatSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('TeamChat');
    }
    next();
});

const apiKeySchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    company_id: { type: Number, required: true },
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    created_by: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    last_used_at: { type: Date },
    expires_at: { type: Date },
    is_active: { type: Boolean, default: true },
    permissions: { type: [String], default: ['upload', 'chat'] },
    usage_count: { type: Number, default: 0 },
    rate_limit: { type: Number, default: 100 } // requests per hour
});

// Pre-save hook for APIKey
apiKeySchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('APIKey');
    }
    next();
});

const apiKeyUsageSchema = mongoose.Schema({
    id: { type: Number, unique: true, sparse: true },
    api_key_id: { type: Number, required: true },
    company_id: { type: Number, required: true },
    endpoint: { type: String },
    method: { type: String },
    status_code: { type: Number },
    ip_address: { type: String },
    user_agent: { type: String },
    duration_ms: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

apiKeyUsageSchema.pre('save', async function(next) {
    if (!this.id) {
        this.id = await getNextId('APIKeyUsage');
    }
    next();
});

module.exports={userSchema,issueSchema,documentSchema,companySchema,roleSchema,chatHistorySchema,teamChatSchema,apiKeySchema,apiKeyUsageSchema}