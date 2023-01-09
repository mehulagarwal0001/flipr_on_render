const router=require('express').Router();
const Profile =require('../modals/ProfileSchema');
const fetchUser=require('../middleware/fetchUser');





router.get('/profile',fetchUser,async(req,res)=>{

/// return profile of user

            const profile = await Profile.findOne({user:req.user.id});

            return res.json({ctc:profile.ctc});

})

router.post('/profile',fetchUser,(req,res)=>{
  
    const aadhar_card=req.files.aadhar_card;
    const pan_card=req.files.pan_card;
    const salary_slip=req.files.salary_slip;
 
   const profile={
       user:req.user.id,
       name:req.body.name,
       bank_name:req.body.bank_name,
       ifsc_code:req.body.ifsc_code,
       ctc:req.body.ctc,
       account_number:req.body.account_number,
       phone_number:req.body.phone_number,
       aadhar_card:Date.now()+aadhar_card.name,
       pan_card:Date.now()+pan_card.name,
       salary_slip:Date.now()+salary_slip.name

   }



    
console.log(profile);
    aadhar_card.mv('public/profiles/'+profile.aadhar_card,(err)=>{
        if(err){
            return res.status(500).json({status:"failed"});
        }
    })
    pan_card.mv('public/profiles/'+profile.pan_card,(err)=>{
        if(err){
            return res.status(500).json({status:"failed"});
        }
    })
  salary_slip.mv('public/profiles/'+profile.salary_slip,(err)=>{
        if(err){
            return res.status(500).json({status:"failed"});
        }
    })


    const saving_profile=new Profile(profile);
    const saved_profile=saving_profile.save();

    return res.json({status:"successfully"});

    // update profile

})



module.exports= router;
