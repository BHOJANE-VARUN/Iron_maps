const mongoose = require("mongoose");

const connectDB = async ()=>{
   await mongoose.connect("mongodb+srv://cv4xb.mongodb.net/Iron_bloods");
}
module.exports = connectDB;