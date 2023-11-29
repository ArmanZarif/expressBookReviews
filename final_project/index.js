const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){ 
//Write the authentication mechanism here            
    if(req.session.authorization) {
        token = req.session.authorization['accessToken']; 
        jwt.verify(token, "secret_key",(err,user)=>{ 
            if(!err){                                               
                req.user = user;
                req.session.username=user.username;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));


// const token=req.query
// const user=jwt.validate(token,esmeRamz).user;
// const foundUser=users.find(id=>user.id==id)
// if(foundUser)
// next();
// else return res().send('you have not logged in');
