const {userModal}=require('./config/db')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const express=require('express');
const cookieParser = require('cookie-parser');
const app=express();
app.use(cookieParser())
app.use(express.json());
const LocalStrategy = require('passport-local').Strategy;
exports.initializingPassport=(passport)=>{
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
    },
    async function(usernameField,passwordField,done){
        try{
            const user = await userModal.findOne({ email: usernameField });

            if(!user){

                return done(null,false);
    
            }
            const match = await bcrypt.compare(passwordField, user.password);

            if(!match){
                return done(null,false);
            }
            else{

                return done(null,user);
            }
        }
        catch(err){
            return done(err);

            
        }
    }
))

};

exports.verifyToken=(req,res,next)=>{

    const token = req.headers.authorization?.split(" ")[1] || req.cookies.authToken;
     if (!token) {
         return res.status(500).redirect('/login');    
     }
     try{
    const roew=jwt.verify(token,process.env.secretKey)
     req.user = roew;
     return next();
     }
     catch (err) {
        return res.json(500).json("Invalid token");   
       }
}




