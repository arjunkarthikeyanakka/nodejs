
//create mini express app
const exp=require('express')
const userApi=exp.Router();

userApi.use(exp.json());

//import mongoclient
const mc = require('mongodb').MongoClient;

//connections string
const databaseUrl = "mongodb+srv://gyro_zeppeli:gyro_zeppeli331@cluster0.0gmg4.mongodb.net/testdb?retryWrites=true&w=majority";

let dbObj ;

//connect to db
mc.connect(databaseUrl,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
    
    if(err){
        console.log("error in database connection : ",err);
    }
    else{
        //get db obj
        dbObj=client.db("testdb")
        console.log("database is successfully connected...");
    }

})



//sample route
userApi.get("/getusers",(req,res)=>{
    res.send({message:"reply from user api"})
})



//export
module.exports=userApi;