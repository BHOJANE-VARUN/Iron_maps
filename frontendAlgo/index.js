
var datalist = [];
// const id = "679629243725a29f1414865e";
// const range = 20;

// minimum range is 20 km 
const fetchdata = async (id,range)=>{
    const data = await fetch("localhost:7777/getdata?hos_id"+id+"=&range="+range);
    
}