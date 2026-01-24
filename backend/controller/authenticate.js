const mongoose=require("mongoose");
const {User,Company}=require("../model/collection");

mongoose.connect(process.env.MONGO_URI);

const loginUser =async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if (!user){
            return res.status(400).json({"error":2});
        }
        const isMatch=(user.password==password);
        if (!isMatch){
            return res.status(406).json({"error":1});
        }
        return res.status(200).json({"error":0,"username":user.name,"useremail":email});
    }
    catch(err){
        console.log("Error at logging in:",error);
        return res.status(400).json({"error":3});
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
        return res.status(200).json({"error":0});
    }
    catch(error){
        console.log("Error at signing up",error);
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

        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            companyId: newCompany.id,
            userId: newUser.id
        });
    } catch (error) {
        console.error("Error during company registration:", error);
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