const router=require('express').Router();
const jwt = require('jsonwebtoken');
const User=require('../modals/User')
const fetchUser=require('../middleware/fetchUser')

//signup
router.post('/signup',async (req,res)=>{
    try {
        const {name,email,password}=req.body;
        const existuser= await User.findOne({email});
        if(existuser){
         return    res.status(400).json({success:false,error:"User Exist"});
        }
        const user= new User({name,email,password});
        //console.log("Hello in request");
        const saveduser=await user.save();
        //console.log(saveduser);
        const data={
            user:{
                id:saveduser.id
            }
        }
        const authToken=jwt.sign(data,process.env.JWT_SECRET);
       // console.log(authToken);
     return   res.json({success:true,authToken:authToken});

    } catch (error) {
        console.log(error.message);
       return  res.status(400).json({success:false,error:"Something Went Wrong"});
    }
  
  
  })
  

//login 
router.post('/login',async (req,res)=>{
  //res.send("login");

  try {
    const {email,password}=req.body;
    const user= await User.findOne({email});
    if(!user)return res.status(400).json({success:false,error:"Wrong Credentials"});
    if(user.password!=password) return res.status(400).json({success:false,error:"Wrong Credentials"});

    const data={
        user:{
            id:user.id
        }
    }
    const authToken=jwt.sign(data,process.env.JWT_SECRET);
    
   return   res.json({success:true,authToken:authToken});

} catch (error) {
    console.log(error);
   return  res.status(400).json({success:false,error:"Something went Wrong"});
}


})


router.get('/getuser',fetchUser,(req,res)=>{
  return   res.json(req.user);
})

module.exports=router