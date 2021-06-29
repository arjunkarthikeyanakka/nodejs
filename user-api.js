
//create mini express app
const exp=require('express')
const userApi=exp.Router();

userApi.use(exp.json());

//import mongoclient
const mc = require('mongodb').MongoClient;

//connections string
const databaseUrl = "mongodb+srv://gyro_zeppeli:gyro_zeppeli331@cluster0.0gmg4.mongodb.net/testdb?retryWrites=true&w=majority";

var dbObj;

const asyncHandler = require('express-async-handler')
var bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
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
    let user_details = await dbObj.collection("usercollection").findOne({username:{$eq:uname}});
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
    let user_details = await dbObj.collection("usercollection").findOne({username:{$eq:newuser.username}});
    if(user_details!==null){
        res.send({message:"user with that username already exists add a new user..."})
    }
    else{
        //hashing password
        let hashed_password = await bcryptjs.hash(newuser.password,7);
        //replace password
        newuser.password = hashed_password;
        //upadate password
        await dbObj.collection("usercollection").insertOne(newuser);
        res.send({message:"new user is added to the userlist..."})
    }
}))


//updating a user from the users list
userApi.put("/updateusers",asyncHandler(async(req,res,next)=>{
    let updatedUser = req.body;
    let user_details = await dbObj.collection("usercollection").findOne({username:{$eq:updatedUser.username}});
    if(user_details===null){
        res.send({message:"user with that username does not exist..."})
    }
    else{
        //hashing password
        // let hashed_password = await bcryptjs.hash(updatedUser.password,7);
        // //replace password
        // updatedUser.password = hashed_password;
        for(det in user_details){
            if(det!=='password' && user_details.det!==null && updatedUser.det!==null)   updatedUser.det=user_details.det;
        }
        //updatedUser.phone=user_details.phone;
        await dbObj.collection("usercollection").updateOne({username:updatedUser.username},{$set:{...updatedUser}});
        res.send({message:"the user is updated..."});
    }
}))


//deleting a user
userApi.delete("/removeusers/:username",asyncHandler(async(req,res,next)=>{
    let username = req.params.username;
    let user_details = await dbObj.collection("usercollection").findOne({username:{$eq:username}});
    if(user_details===null){
        res.send({message:"user with that name does not exist..."})
    }
    else{
        await dbObj.collection("usercollection").deleteOne({username:{$eq:username}});
        res.send({message:"user is deleted successfully..."});
    }
    
}))

userApi.delete('/deleteallusers',asyncHandler(async(req,res,next)=>{
    await dbObj.collection("usercollection").deleteMany();
    res.send({message:"all users are deleted..."});
}))


//user login
userApi.post('/login',asyncHandler(async(req,res,next)=>{
    user_credentials = req.body;
    let user_found = await dbObj.collection("usercollection").findOne({username:{$eq:user_credentials.username}});
    console.log(user_found);
    if(user_found===null){
        //user is not found , user with that usenname does not exist...
        res.send({message:"invalid username..."});
    }
    else{
        //username is right , but we now check password
        let pass_word = await bcryptjs.compare(user_credentials.password,user_found.password)
        console.log(pass_word)
        if(pass_word===true){
            //the credentials are correct now we have to create a token for the user
            //creating token
            let user_token = await jwt.sign({username:user_found.username},'abcde',{expiresIn:240});
            //sending token to user
            console.log(user_token)
            res.send({message:"login successful",token:user_token,username:user_credentials.username});
        }
        else{
            res.send({message:`invalid password ${user_found.password} and ${user_credentials.password}...`});
        }
    }
}))

userApi.post('/hash/:pass',asyncHandler(async(req,res,next)=>{
    let pd = req.params.pass;
    let hd = await bcryptjs.hash(pd,7);
    res.send({before:pd,after:hd});
}))




//export
module.exports=userApi;