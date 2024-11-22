const express=require('express');
const dotenv=require('dotenv').config();
const {conn,userModal}=require('./config/db');
const expressSession=require('express-session');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const {initializingPassport,verifyToken}=require('./passportConfig')
const app=express();
app.use(cookieParser());
const bcrypt=require('bcrypt');
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Parses form data
app.set('view engine', 'ejs');
const path=require('path');
app.set('views', path.join(__dirname, '../views'));
const passport=require('passport');
const { verify } = require('crypto');
initializingPassport(passport);
app.use(passport.initialize());


app.post('/login', async (req, res, next) => { passport.authenticate("local",(err,user,info)=>{
        
    if(err){
        console.error("Authentication error:", err); // Log the error

        return res.status(500).json("Error occured try again");
    }
    else if(!user){
        return res.status(401).json("Invalid Credentials");
    }

    const payload={id:user._id,email:user.email};
    const token=jwt.sign(payload,process.env.secretKey,{expiresIn:'1h'});


    res.cookie('authToken',token,{
        httpOnly: true,
        path:'/', // Prevent client-side JavaScript access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Prevent CSRF
        maxAge: 3600000 // 1 hour in milliseconds

         // Use HTTPS in production
    })
    return res.status(200).redirect('/');



    
    
    
})(req,res,next);
});

app.get('/register',(req,res)=>{
    res.render('frontend/register')
})

app.get('/login',(req,res)=>{
    res.render('frontend/login')
})
app.post('/register',async (req,res)=>{
    console.log(req.body)
    const {username,email,password}=req.body;
    const kkk=await userModal.findOne({email});
    if(kkk){
        res.status(400).json("User already registered");
    }
    else{
        const kjh=new userModal({
            username,
            email,
            password:await bcrypt.hash(password,10)

        })
        const savedUser = await kjh.save();
        const row=jwt.sign({username:savedUser.username,email:savedUser.email,password:savedUser.password},process.env.secretKey, { expiresIn: '1h' });
        res.status(200).redirect('/login');
    }
})
app.get('/',verifyToken,(req,res)=>{
    res.render('frontend/dashboard')
})

app.get("/profile",verifyToken,(req,res)=>{
    const user =req.body;
    res.send(req.user);
})
app.get('/logout',(req,res)=>{
    res.clearCookie('authToken'); // Clear token from cookies
    res.status(200).redirect('/login');
    console.log('Cookies cleared:', req.cookies);

})

const port=process.env.PORT;

app.listen(port,()=>{
    console.log(`Port is listening on ${port} and url is http://localhost:${port} `)
})

