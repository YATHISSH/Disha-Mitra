const express=require("express");
const bodyParser=require("body-parser");
const authRoutes=require("./routes/authRoutes");
const issueRoute=require("./routes/issueRoute")
const documentRoutes=require("./routes/documentRoutes");
const roleRoutes=require("./routes/roleRoutes");
const cors=require("cors");
const PORT=3001;

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/auth",authRoutes);
app.use("/issue",issueRoute);
app.use("/document",documentRoutes);
app.use("/role",roleRoutes);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});