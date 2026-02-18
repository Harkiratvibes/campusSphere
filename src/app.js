require("dotenv").config();


const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req,res)=>{
  res.send("🚀 CampusSphere API Live!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", ()=>{
  console.log("CampusSphere running on " + PORT);
});
 