//import 

const json  = require('express')
const exp = require('express')

//create express object
const app = exp()

//this below line will allow us to receive json data from post or put request
app.use(exp.json())

function found_user(uid){
    for(userObj of users){
        k=Number(userObj.id);
        if(userObj.id==uid)
            return true;
    }
    return false;
}


//middlewares


let users=[]
//creating user api
//http://localhost:3500/user

//get users
app.get('/user',(req,res)=>{
    
    if(users.length==0){
        res.send({message:"the user list is empty"})
    }
    else{
        res.send(users);
    }
    
})

//get user by id
app.get('/user/:id',(req,res)=>{
    
    let uid = req.params.id;
    if(users.length===0){
        res.send({message:"user list is empty add a user..."})
    }
    else{
        flag=found_user(uid);
        if(flag){
            res.send(userObj);
        }
        else{
            res.send({message:`user with id ${uid} is not found...`});
        }
    }
})


//post users
app.post('/createuser',(req,res)=>{

    let newuser = req.body;
    let uid = newuser.id;
    found = found_user(uid);
    if(!found){
        users=[...users,newuser];
        res.send({message:"new user added to user list..."});
        
    }
    else{
        res.send({message:`user with that id already exists...`})
    }

})

//update users by id
app.put('/updateuser',(req,res)=>{

    let new_data = req.body;
    if(users.length===0){
        res.send({message:"the users list is empty you cannot make changes to an empty list , try adding new elements to modify them later..."})
    }
    else{
        let uid = (+new_data.id);
        let found_ind = found_user(uid);
        if(found_ind){
            let l = users.length;
            for(i=0;i<l;i++){
                k=Number(users[i].id);
                if(k===uid){
                    users.splice(i,1);
                    break;
                }
            }
            users = [...users,new_data];
            res.send({message:`user with id ${uid} is updated go check it out ...`});
        }
        else{
            res.send({message:"user not found!.."});
        }
    }

})

//delete user by id
app.delete('/deleteuser/:id',(req,res)=>{

    if(users.length===0){
        res.send({message:"users list is empty..."});
    }
    else{
        let uid = (+req.params.id);
        let flag = found_user(uid);
        if(flag){
            let l = users.length;
            for(i=0;i<l;i++){
                k=Number(users[i].id);
                if(k===uid){
                    users.splice(i,1);
                    break;
                }
            }
            res.send({message:`user data with id ${uid} is deleted ... check out the new updated users list `})
        }
        else{
            res.send({message:`user data with id ${uid} is not found in the users list...`})
        }
    }

})

//assign port number
const port = 3500;
app.listen(port,()=>console.log(`the app is up and running on port ${port}...`))