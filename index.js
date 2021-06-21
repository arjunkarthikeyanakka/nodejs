
const exp = require("express")
const app = exp();

//import APIS
const userApi = require("./APIS/user-api")
const productApi = require("./APIS/product-api")
const adminApi = require("./APIS/admin-api")


//execute specific api based on path
app.use("/user", userApi)
app.use("/product", productApi)
app.use("/admin",adminApi);

//invalid path
app.use((req,res,next)=>{
    res.send({message:`${req.url} is an invalid path...`})
})

//error handling middleware
app.use((err,req,res,next)=>{
    res.send({message:`error : ${err.message}`})
})


//assign port
const port = 3000;
app.listen(port, () => console.log(`server is up and running on port : ${port}...`))