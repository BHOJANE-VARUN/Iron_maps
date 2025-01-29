const mongoose = require("mongoose");

const Schm = mongoose.Schema( {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    phone:{
      type:String,
      required:true
    }
  });

  Schm.index({ location: "2dsphere" }); // Important for geospatial queries

const Philanthropist = mongoose.model("philanthropists",Schm);



const Donor = Philanthropist.discriminator(
    "Donor",
    new mongoose.Schema({ 
        blood_type:{
            type:String,
            enum:["o_negative","o_positive","a_positive","a_negative","ab_positive","ab_negative","b_positive","b_negative"],
        },
        age:{
            type:Number,
        },
     })
  );
  const Bank = Philanthropist.discriminator(
    "Bank",
    new mongoose.Schema({
        o_negative:Number,
        o_positive:Number,
        a_positive:Number,
        a_negative:Number,
        ab_positive:Number,
        ab_negative:Number,
        b_positive:Number,
        b_negative:Number
    })
  );


  async function createUser(role, data) {
    switch (role) {
      case "donor":
        return await Donor.create(data);
      case "bank":
        return await Bank.create(data);
    }
  }

module.exports = {createUser,Philanthropist};