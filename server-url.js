const http = require("http")
const server = http.createServer((req,res)=>{
    //get request handler
    if(req.method=="GET"){
        if(req.url==='/getusers'){
            console.log("users data");
            res.write("get users data");
            res.end();
        }
        else if(req.url==='/getproducts'){
            console.log("products data");
            res.write("get products data");
            res.end();
        }
    }
})

server.listen(2500,()=>console.log("second server is up and running..."));