//create mini express app
const exp=require('express')
const adminApi=exp.Router();




//sample route
adminApi.get("/getadmin",(req,res)=>{
    res.send({message:"reply from admin api"})
})



//export
module.exports=adminApi;