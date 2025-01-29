const mongoose = require("mongoose");


const Schm = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});

const Hospitals = new mongoose.model("Hospitals",Schm);

module.exports = Hospitals;