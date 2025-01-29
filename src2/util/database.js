const mongoose = require("mongoose");

const connectDB = async ()=>{
   await mongoose.connect("mongodb+srv://varunbhojane07:Varunbhojane07@varun-cluster.cv4xb.mongodb.net/Iron_bloods");
}
module.exports = connectDB;