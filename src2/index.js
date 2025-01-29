const express = require("express");
const port = 7777;
const app = express();
const connectDB = require("./util/database.js");
app.use(express.json());
const { createUser, Philanthropist } = require("./models/philanthropists.js");
const Hospitals = require("./models/hospitals.js");
const getGeocode = require("./../src/externalApi/geocoding.js");
const blood_comp = require("./util/compatible_blood_types.js");

app.post("/adddonor", async (req, res) => {
  try {
    const { name, address, blood_type, age, phone } = req.body;
    const coordinates = await getGeocode(address);
    if (coordinates == "Invalid") {
      return res.status(404).json({ error: "Invalid address" });
    }
    const { lng, lat } = coordinates;
    const result = await createUser("donor", {
      name,
      address,
      blood_type,
      age,
      phone,
      location: { type: "Point", coordinates: [lng, lat] },
    });
    console.log(result);

    res.json({ message: "donor added successfully" });
  } catch (error) {
    res.json(error);
  }
});

app.post("/addbloodbank", async (req, res) => {
  try {
    var {
      name,
      address,
      phone,
      o_negative,
      o_positive,
      a_positive,
      a_negative,
      ab_positive,
      ab_negative,
      b_positive,
      b_negative,
    } = req.body;
    o_negative = o_negative || 0;
    o_positive = o_positive || 0;
    a_positive = a_positive || 0;
    a_negative = a_negative || 0;
    ab_positive = ab_positive || 0;
    ab_negative = ab_negative || 0;
    b_positive = b_positive || 0;
    b_negative = b_negative || 0;
    const coordinates = await getGeocode(address);
    if (coordinates == "Invalid") {
      return res.status(404).json({ error: "Invalid address" });
    }
    const { lng, lat } = coordinates;
    await createUser("bank", {
      name,
      address,
      o_negative,
      o_positive,
      a_positive,
      a_negative,
      ab_positive,
      ab_negative,
      b_positive,
      b_negative,
      phone,
      location: { type: "Point", coordinates: [lng, lat] },
    });

    res.json({ message: "Bank added successfully" });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

app.post("/addhospital", async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const coordinates = await getGeocode(address);
    if (coordinates == "Invalid") {
      return res
        .status(404)
        .json({ Error: "Invalid Address or provide more details" });
    }
    const { lng, lat } = coordinates;
    await Hospitals.create({
      name,
      phone,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
    res.json({ message: "Hospital added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/getbank", async (req, res) => {
  try {
    const hos_id = req.query.hos_id;
    const range = req.query.range * 1000 || 10000;
    const blood_type = req.query.blood_type;
    const allowed_blood_type = blood_comp(blood_type);
    const page = req.query.page || 0;
     // console.log(allowed_blood_type);
    if (allowed_blood_type.length == 0) {
      return res.status(404).json({ error: "Invalid blood type" });
    }
    if (hos_id == undefined) {
      return res.status(404).json({ error: "Invalid hospital ID" });
    }
    const result = await Hospitals.findById(hos_id);
    if (result == null) {
      return res.status(404).json({ error: "Invalid hospital ID" });
    }
    // {
    //     <location field>: {
    //       $near: {
    //         $geometry: {
    //            type: "Point" ,
    //            coordinates: [ <longitude> , <latitude> ]
    //         },
    //         $maxDistance: <distance in meters>,
    //         $minDistance: <distance in meters>
    //       }
    //     }
    //  }
   // console.log( allowed_blood_type.map(field => ({ [field]: { $gt: 0 } })));
    const Points = await Philanthropist.find({
      location: {
        $near: {
          $geometry: result.location,
          $maxDistance: range,
        },
      },
       __t:"Bank",
       $or: allowed_blood_type.map(field => ({ [field]: { $gt: 0 } }))
    }).skip(page*5).limit(5);
    res.json(Points);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server" });
  }
});

app.get("/getdonor", async (req, res) => {
  try {
    const hos_id = req.query.hos_id;
    const range = req.query.range * 1000 || 10000;
    const blood_type = req.query.blood_type;
    const allowed_blood_type = blood_comp(blood_type);
    const page = req.query.page || 0;
     // console.log(allowed_blood_type);
    if (allowed_blood_type.length == 0) {
      return res.status(404).json({ error: "Invalid blood type" });
    }
    if (hos_id == undefined) {
      return res.status(404).json({ error: "Invalid hospital ID" });
    }
    const result = await Hospitals.findById(hos_id);
    if (result == null) {
      return res.status(404).json({ error: "Invalid hospital ID" });
    }
  //  console.log(allowed_blood_type.map(field => ({ ["blood_type"]: field })))
    const Points = await Philanthropist.find({
      location: {
        $near: {
          $geometry: result.location,
          $maxDistance: range,
        },
      },
       __t:"Donor",
       $or: allowed_blood_type.map(field => ({ ["blood_type"]: field }))
    }).skip(page*5).limit(5);
    res.json(Points);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server" });
  }
});



connectDB().then(() => {
  console.log("database is connected");
  app.listen(port, () => {
    console.log("app is running on", port);
  });
});
