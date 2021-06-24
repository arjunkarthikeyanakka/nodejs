
//create mini express app
const exp=require('express')
const userApi=exp.Router();

userApi.use(exp.json());

//import mongoclient
const mc = require('mongodb').MongoClient;

//connections string
const databaseUrl = "mongodb+srv://gyro_zeppeli:gyro_zeppeli331@cluster0.0gmg4.mongodb.net/testdb?retryWrites=true&w=majority";

var dbObj ;

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
//getting users list as a whole
userApi.get("/getusers",(req,res,next)=>{
    //read documents from user list
    dbObj.collection("usercollection").find().toArray((err,userList)=>{
        if(err){
            res.send({message:err.message});
        }
        else{
            if(userList.length===0) res.send({message:"user list is empty..."})
            else res.send({message:userList});
        }
    })
})


//finding users with their name from the users list
userApi.get("/getusers/:username",(req,res,next)=>{
    uname = req.params.username;
    dbObj.collection("usercollection").findOne({name:{$eq:uname}},(err,userprofile)=>{
        if(err){
            res.send({message:err.message})
        }
        else{
            if(userprofile===null)
                res.send({message:"user with that name does not exist..."})
            else
                res.send({message:userprofile})
        }
    })
    
})



//post request handler
userApi.post("/createusers",(req,res,next)=>{
    newuser=req.body;
    dbObj.collection("usercollection").findOne({name:{$eq:newuser.name}},(err,userObj)=>{
        if(err){
            res.send({message:`error in creating a new user is : ${err.message}`});
        }
        else if(userObj!==null){
            res.send({message:"the user with that name already exists , duplicates are not allowed..."});
        }
        else{
            dbObj.collection("usercollection").insertOne(newuser,(err,userprofile)=>{
                if(err){
                    res.send({message:`error in creating new user is : ${err.message}`})
                }
                else{
                    res.send({message:"new user is added to the userlist..."})
                }
            })
        }
    })
})


//updating a user from the users list
userApi.put("/updateusers",(req,res,next)=>{
    updatedUser = req.body;
    dbObj.collection("usercollection").findOne({name:{$eq:updatedUser.name}},(err,userObj)=>{
        if(err){
            res.send({message:`error in updating a user is : ${err.message}`});
        }
        else{
            if(userObj===null){
                res.send({message:"user with that id does not exist..."});
            }
            else{
                dbObj.collection("usercollection").updateOne({name:userObj.name},{
                    $set: {...updatedUser}//the three dots will assign the values of the new object to the old existing copy of the same user
                    /*
                        other method to set values of a user:
                        $set : {
                            salary : userObj.salary,
                            city : userObj.city,
                            role : userObj.role 
                        }
                    */
                },(err,userObj)=>{
                    if(err){
                        res.send({message:`error in updating user is : ${err.message}`});
                    }
                    else{
                        res.send({message:"the user is updated..."});
                    }
                })
            }
        }
    })
})


//deleting a user
userApi.delete("/removeusers/:username",(req,res,next)=>{
    removedUser = req.body;
    username = req.params.username;
    dbObj.collection("usercollection").findOne({name:{$eq:username}},(err,userObj)=>{
        if(err){
            res.send({message:`error in deleting the user is : ${err.message}`})
        }
        else{
            if(userObj===null){
                res.send({message:"user with that name does not exist..."});
            }
            else{
                dbObj.collection("usercollection").deleteOne({name:{$eq:username}},(err,deleted)=>{
                    if(err){
                        res.send({message:`error in deleting the user is : ${err.message}`})
                    }
                    else{
                        res.send({message:"user is deleted successfully..."})
                    }
                })
            }
        }
    })
})


//export
module.exports=userApi;