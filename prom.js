let status = true;

    let PromObj = new Promise((resolve,reject)=>{
        if(status==true){
            setTimeout(()=>{
                resolve("Hey guys ,the teaser is out now, enjoy!");
            },3500)
        }
        else{
            setTimeout(()=>{
                reject("Sorry guys, there is a techincal issue new date will be announced soon...")
            },3500)
        }
    })

module.exports = PromObj

PromObj
    .then((data)=>{
        console.log("first then");
        return data+".";
    })
    .then((data)=>{
        console.log("second then");
        return data+".";
    })
    .then((data)=>{
        console.log("result is: ",data);
    })
    .catch((err)=>{
        console.log("error is :",err);
    })