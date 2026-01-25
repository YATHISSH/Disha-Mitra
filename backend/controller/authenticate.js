const mongoose=require("mongoose");
const jwt = require('jsonwebtoken');
const {User,Company}=require("../model/collection");
const { recordActivity } = require('../utils/auditLogger');

mongoose.connect(process.env.MONGO_URI);

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            name: user.name,
            company_id: user.company_id 
        },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '7d' }
    );
};

const loginUser =async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if (!user){
            await recordActivity(req, { action: 'LOGIN', resource: '/auth/login', result: 400, metadata: { email } });
            return res.status(400).json({"error":2, "message": "User not found"});
        }
        const isMatch=(user.password==password);
        if (!isMatch){
            await recordActivity(req, { action: 'LOGIN', resource: '/auth/login', result: 406, metadata: { email }, companyId: user.company_id, userId: user.id });
            return res.status(406).json({"error":1, "message": "Incorrect password"});
        }
        
        const token = generateToken(user);
        await recordActivity(req, { action: 'LOGIN', resource: '/auth/login', result: 200, metadata: { email }, companyId: user.company_id, userId: user.id });
        
        return res.status(200).json({
            "error":0,
            "message": "Login successful",
            "token": token,
            "user": {
                id: user.id,
                name: user.name,
                email: user.email,
                company_id: user.company_id,
                is_active: user.is_active
            }
        });
    }
    catch(err){
        console.log("Error at logging in:",err);
        await recordActivity(req, { action: 'LOGIN', resource: '/auth/login', result: 500, metadata: { email: req.body?.email } });
        return res.status(400).json({"error":3, "message": "Server error"});
    }
}

const registerUser = async (req, res) => {
    try{
    const {fullname,password,email}=req.body;
    console.log(req.body);
    const user=await User.findOne({email});
    if (user){
        return res.status(409).json({"error":1});
    }
    const newUser=new User({
        name:fullname,
        password:password,
        email:email,
    });
        await newUser.save();
        await recordActivity(req, { action: 'USER_REGISTER', resource: '/auth/signup', result: 200, metadata: { email } });
        return res.status(200).json({"error":0});
    }
    catch(error){
        console.log("Error at signing up",error);
        await recordActivity(req, { action: 'USER_REGISTER', resource: '/auth/signup', result: 400, metadata: { email: req.body?.email } });
        return res.status(400).json({"error occured":2});
    }
};

const registerCompany = async (req, res) => {
    try {
        const {
            companyName,
            industryType,
            adminName,
            adminEmail,
            adminPassword,
            companyAddress,
            city,
            state,
            postalCode,
            phoneNumber,
            employees,
            website
        } = req.body;

        console.log("Company Registration Body:", req.body);

        // Check if company with this email already exists
        const existingCompany = await Company.findOne({ adminEmail });
        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: "Company with this email already exists"
            });
        }

        // Create new company
        const newCompany = new Company({
            companyName,
            industryType,
            adminName,
            adminEmail,
            adminPassword,
            companyAddress,
            city,
            state,
            postalCode,
            phoneNumber,
            employees: employees || 0,
            website: website || '',
            status: 'active'
        });

        await newCompany.save();
        console.log("Company registered successfully:", newCompany);

        // Create user record for admin
        const newUser = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            company_id: newCompany.id,
            is_active: true
        });

        await newUser.save();
        console.log("Admin user created successfully:", newUser);

        await recordActivity(req, { action: 'COMPANY_REGISTER', resource: '/auth/company-signup', result: 201, metadata: { companyName, adminEmail } });

        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            companyId: newCompany.id,
            userId: newUser.id
        });
    } catch (error) {
        console.error("Error during company registration:", error);
        await recordActivity(req, { action: 'COMPANY_REGISTER', resource: '/auth/company-signup', result: 400, metadata: { adminEmail: req.body?.adminEmail } });
        return res.status(400).json({
            success: false,
            message: "Error during company registration",
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { companyId, name, email, password, role } = req.body;

        // Validate required fields
        if (!companyId || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            company_id: companyId,
            is_active: true
        });

        await newUser.save();
        console.log("User created successfully:", newUser);
        await recordActivity(req, { action: 'USER_CREATE', resource: '/auth/create-user', result: 201, metadata: { email } });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                company_id: newUser.company_id,
                is_active: newUser.is_active,
                role: role || 'Viewer'
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        await recordActivity(req, { action: 'USER_CREATE', resource: '/auth/create-user', result: 400, metadata: { email: req.body?.email } });
        return res.status(400).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }
};

const listUsersByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        // Validate companyId
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company ID is required"
            });
        }

        // Find all users for the company
        const users = await User.find({ company_id: companyId });

        return res.status(200).json({
            success: true,
            count: users.length,
            users: users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                company_id: user.company_id,
                is_active: user.is_active
            }))
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(400).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

module.exports={loginUser,registerUser,registerCompany,createUser,listUsersByCompany};