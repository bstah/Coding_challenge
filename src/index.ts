import express from "express";
import axios from "axios";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache();
const port = process.env.PORT || 8080; // default port to listen

interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.get("/users", async (req, res) =>{
    let users = await axios.get("reqres.in/api/users?page=2");
    if(users.data){
        let success = true;
        users.data.array.forEach((item:User) => {
            const isSuccess = cache.set(item.id, item)
            if(!isSuccess)
                success = false;
        });
        if(success)
            return res.json({message: "successfully got users",data:users.data});
        return res.json({message: "unable to set cache", data: users.data});
    }
    return res.json({message: "unable to get users"});
})

app.post("users/create", (req, res) => {
    let newUser:User = {...req.body}
    if(newUser){
        const success = cache.set(newUser.id, newUser);
        if(success)
            return res.json({message:"New user created", data: newUser})
        return res.json({message: "unable to create user"})
    }
    return res.json({message: "unable to create user"})
})

app.put("users/update", (req, res) => {
    let updateUser:User = {...req.body};
    if(updateUser){
        let oldUser:User = cache.take(updateUser.id);
        const success = cache.set(updateUser.id, updateUser);
        if(success)
            return res.json({message: "successfully updated user", data: updateUser});
        
        cache.set(oldUser.id, oldUser);
        return res.json({message: "unable to update user"});
    }
    return res.json({message: "unable to update user"});
})

app.delete("/users/:id", (req, res) => {
    let value = cache.del(req.params.id)
    if(value > 0)
        return res.json({message: "success", data: value})
    return res.json({message: "unable to delete user"});
})

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );