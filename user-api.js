
//create mini express app
const exp=require('express')
const userApi=exp.Router();

userApi.use(exp.json());

//import mongoclient
const mc = require('mongodb').MongoClient;

//connections string
const databaseUrl = "mongodb+srv://gyro_zeppeli:gyro_zeppeli331@cluster0.0gmg4.mongodb.net/testdb?retryWrites=true&w=majority";

var dbObj ;

const asyncHandler = require('express-async-handler')

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
//getting users list 
userApi.get("/getusers",asyncHandler( async(req,res,next)=>{
    //read documents from user list
    let usersList = await dbObj.collection("usercollection").find().toArray();
    if(usersList.length===0) res.send({message:"user list is empty..."})
    else res.send({message:usersList});
}))


//finding users with their name from the users list
userApi.get("/getusers/:username", asyncHandler(async(req,res,next)=>{
    let uname = req.params.username;
    let user_details = await dbObj.collection("usercollection").findOne({name:{$eq:uname}});
    if(user_details===null){
        res.send({message:"user with that name does not exist..."})
    }
    else {
        res.send({message:user_details});
    }
    
}))



//post request handler
userApi.post("/createusers",asyncHandler(async(req,res,next)=>{
    let newuser=req.body;
    let user_details = await dbObj.collection("usercollection").findOne({name:{$eq:newuser.name}});
    if(user_details!==null){
        res.send({message:"user with that name already exists add a new user..."})
    }
    else{
        await dbObj.collection("usercollection").insertOne(newuser);
        res.send({message:"new user is added to the userlist..."})
    }
}))


//updating a user from the users list
userApi.put("/updateusers",asyncHandler(async(req,res,next)=>{
    let updatedUser = req.body;
    let user_details = await dbObj.collection("usercollection").findOne({name:{$eq:updatedUser.name}});
    if(user_details===null){
        res.send({message:"user with that name does not exist..."})
    }
    else{
        await dbObj.collection("usercollection").updateOne({name:updatedUser.name},{$set:{...updatedUser}});
        res.send({message:"the user is updated..."});
    }
}))


//deleting a user
userApi.delete("/removeusers/:username",asyncHandler(async(req,res,next)=>{
    let username = req.params.username;
    let user_details = await dbObj.collection("usercollection").findOne({name:{$eq:username}});
    if(user_details===null){
        res.send({message:"user with that name does not exist..."})
    }
    else{
        await dbObj.collection("usercollection").deleteOne({name:{$eq:username}});
        res.send({message:"user is deleted successfully..."});
    }
    
}))


//export
module.exports=userApi;