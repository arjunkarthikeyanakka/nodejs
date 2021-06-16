// console.log("server works!!!")

//import 
const http  = require("http");

//create server
const server = http.createServer((req,res)=>{
    // console.log(req.method);
    // //console.log(req.httpVersion);//gives us the http version
    // res.end('the server is responding !');
    
    //get req handler
    if(req.method=="GET"){
        res.write("hello get is requested!\n")
        //res.statusCode(200);
        res.end("get request is used");//displayed when get request is used
    }
    //put req header
    if(req.method=="PUT"){
        res.write("hello put is requested!\n")
        res.end("put request is used");//displayed when put request is used
    }
    //push req header
    if(req.method=="POST"){
        res.write("hello post is requested!\n")
        res.end("post request is used");//displayed when push request is used
    }
    //delete req header
    if(req.method=="DELETE"){
        res.write("hello delete is requested!\n")
        res.end("delete request is used");//displayed when delete request is used
    }
}
);

//assign port number
server.listen(2000,()=>console.log("server is up and running..."));
