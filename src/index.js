const express = require("express");
const {connectDB,getAsyncConnection} = require("./config/database");
const app = express();
const getGeocode = require("./externalApi/geocoding")
const port = 7777;
var asyncDBconnection;
app.use(express.json());



// donor_id
// name
// blood_type
// address
// lat
// lng
// phone
app.post("/adddonator",async (req,res)=>{
    const {name,address,phone,blood_type} = req.body;
    const result = await getGeocode(address);
    if(result=="Invalid")
        {
             res.status(500).send({"error":"invalid address"});
        }
        const {lng,lat} = result;
    //  console.log(lat);
    //  console.log(lng);
    //connectDB.query("insert into users(name,phone,age,landmark,street,taluka,pincode,district,state,country) values(" + name+","+phone+","+age+","+landmark+","+street+","+taluka+","+pincode+","+district+","+state+","+country+")");
    const queryForadddonor = "insert into iron_bloods.donors(name,blood_type,address,lat,lng,phone) values(\"" + name+"\",\""+blood_type+"\",\""+address+"\","+lat+","+lng+",\""+phone+"\")";
    //console.log(queryForadddonor);
    connectDB.query(queryForadddonor,(err)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({
                "error":"errro occuried",
            })
            return;
        }
        res.json("donor successfully added");
    })
})


app.post("/addhospital", async (req,res)=>{
    const {name,address} = req.body;
    const result = await getGeocode(address);
    if(result=="Invalid")
        {
             res.status(500).send({"error":"invalid address"});
        }
        const {lng,lat} = result;
    //  console.log(lat);
    //  console.log(lng);
    //connectDB.query("insert into users(name,phone,age,landmark,street,taluka,pincode,district,state,country) values(" + name+","+phone+","+age+","+landmark+","+street+","+taluka+","+pincode+","+district+","+state+","+country+")");
    const queryForaddbank = "insert into iron_bloods.hospitals(name,address,lat,lng) values(\"" + name+"\",\""+address+"\","+lat+","+lng+")";
   // console.log(queryForaddbank)
    connectDB.query(queryForaddbank,(err)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({
                "error":"errro occuried",
            })
            return;
        }
        res.json("hospital successfully added");
    })

})
////////////// add route for /addbloodbank
// name
// address
// lat
// lng
// o_negative
app.post("/addbloodbank", async (req,res)=>{
    const {name,address,o_negative} = req.body;
   const result = await getGeocode(address);
   if(result=="Invalid")
   {
       return res.status(500).send({"error":"invalid address"});
   }
   const {lng,lat} = result;
    //connectDB.query("insert into users(name,phone,age,landmark,street,taluka,pincode,district,state,country) values(" + name+","+phone+","+age+","+landmark+","+street+","+taluka+","+pincode+","+district+","+state+","+country+")");
    const queryForaddbloodbank = "insert into iron_bloods.bloodbanks(name,address,lat,lng,o_negative) values(\"" + name+"\",\""+address+"\","+lat+","+lng+","+o_negative+")";
    connectDB.query(queryForaddbloodbank,(err)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({
                "error":"errro occuried",
            })
            return;
        }
        res.json("blood bank successfully added");
    })

})

app.get("/donor",(req,res)=>{
    const page = req.query.page || 1;
    const range = req.query.range || 10;
    const blood_type =  req.query.blood_type || "O+";
    const id = req.query.id;
    if(id==undefined)
    {
        return res.json({"message":"please provide hospital id"});
    }

    const query = "SELECT d.name, d.blood_type, d.address, d.phone, hdd.distance FROM iron_bloods.Hospital_Donor_Distance hdd JOIN iron_bloods.Donors d ON hdd.donor_id = d.donor_id WHERE hdd.hospital_id = "+id+" AND hdd.distance <= "+range+" AND d.blood_type = \""+blood_type+"\" ORDER BY hdd.distance ASC LIMIT "+page*10+";";
    //console.log(query);
    connectDB.query(query,(err,result)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({
                "error":"errro occuried",
            })
            return;
        }
        res.json(result);
    })

})

app.get("/bloodbank",(req,res)=>{
    const page = req.query.page || 1;
    const range = req.query.range || 10;
    const blood_type =  req.query.blood_type || "O+";
    const id = req.query.id;
    if(id==undefined)
    {
        return res.json({"message":"please provide hospital id"});
    }


    const query = "SELECT bb.name, bb.address, hbbd.distance, bb.o_negative FROM Hospital_BloodBank_Distance hbbd JOIN BloodBanks bb ON hbbd.blood_bank_id = bb.blood_bank_id WHERE hbbd.hospital_id = " +id+ " AND hbbd.distance <=  "+range+" AND bb." + blood_type + ">0  ORDER BY hbbd.distance ASC LIMIT "+page*10+";";
    console.log(query);
    connectDB.query(query,(err,result)=>{
        if(err)
        {
            console.error(err);
            res.status(500).json({
                "error":"errro occuried",
            })
            return;
        }
        res.json(result);
    })

})

app.get("/data", async (req,res)=>{
    const sdonor = req.headers.sdonor || 0;
    const sbank = req.headers.bdonor || 0;
    const range = req.headers.range || 10;
    const blood_type =  req.headers.blood_type || "o_negative";
    const id = req.headers.id;
    if(id==undefined)
    {
        return res.json({"error":"please provide valid hospital ID"});
    }
    try {
        const query = "SELECT d.name, d.blood_type, d.address, d.phone, hdd.distance FROM iron_bloods.Hospital_Donor_Distance hdd JOIN iron_bloods.Donors d ON hdd.donor_id = d.donor_id WHERE hdd.hospital_id = "+id+" AND hdd.distance <= "+range+" AND d.blood_type = \""+blood_type+"\" ORDER BY hdd.distance ASC LIMIT 10 offset "+sdonor+";";
        const query2 = "SELECT bb.name, bb.address, hbbd.distance, bb.o_negative FROM Hospital_BloodBank_Distance hbbd JOIN BloodBanks bb ON hbbd.blood_bank_id = bb.blood_bank_id WHERE hbbd.hospital_id = " +id+ " AND hbbd.distance <=  "+range+" AND bb." + blood_type + ">0  ORDER BY hbbd.distance ASC LIMIT 10 offset "+sbank+";";
        const [donors] = await asyncDBconnection.execute(query);
        const [banks] = await asyncDBconnection.execute(query2);
        const result = [];
        var a = 0,b =0;

        while(donors.length>a && banks.length>b && result.length<10)
        {  
            if((donors[a].distance+10)<banks[b].distance)
            {
                result.push(donors[a]);
                a += 1;
            }
            else{
                result.push(banks[b]);
                b += 1;
            }
        }
        while(donors.length>a && result.length<10)
        {
            result.push(donors[a]);
            a += 1;
        }
        while(banks.length>b && result.length<10)
        {
            result.push(banks[b]);
            b += 1;
        }
       res.json(result);
    } catch (error) {
        console.error('Error:', error);
    }
    
})

connectDB.connect(function(err) {
    if (err) throw err;
    console.log("sync Connected!");
    getAsyncConnection().then((result) => {
    console.log("async Connected!");
        asyncDBconnection = result;
           app.listen(port,()=>{
        console.log("app is listening on port no",port);
    })
    }).catch((err) => {
        console.error(err);
    });
});
