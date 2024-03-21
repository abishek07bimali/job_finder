const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const { createUser, login } = require("./controllers/user_controllers");
const cors = require("cors");
const multipart = require('connect-multiparty');
const cloudinary=require('cloudinary').v2




// making express app
const app = express();
// dotenv config
dotenv.config();

// cors policy
const corsPolicy = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsPolicy));




// database connection
connectDB();
app.use(express.json());

app.use(multipart())

cloudinary.config({ 
  cloud_name: 'dez6fnovx', 
  api_key: '759197423617715', 
  api_secret: 'wC7shvBz2tq6oPIWq--_nIQpuIQ' 
});



// user Route
app.use("/api/user", require("./routes/userRoute"));
// jobs Route
app.use("/api/jobs", require("./routes/jobsRoute"));
// liked /saved Jobs
app.use("/api/saved", require("./routes/likesJobsRoute"));
// user details
app.use("/api/userdetails", require("./routes/userdetailRoute"));
// application
app.use("/api/application", require("./routes/applicationRoute"));
// comment
app.use("/api/comment", require("./routes/commentRoutes"));
// contact message 
app.use("/api/contact", require("./routes/contactRoutes"));



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

module.exports= app;