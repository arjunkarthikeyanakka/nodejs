//create mini express app
const exp=require('express')
const userApi=exp.Router();

userApi.use(exp.json());

//sample route
userApi.get("/getusers",(req,res)=>{
    res.send({message:"reply from user api"})
})



//export
module.exports=userApi;