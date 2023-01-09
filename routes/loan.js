const router=require('express').Router();
const fetchUser=require('../middleware/fetchUser');
const Ask =require('../modals/AskSchema');
const Modify =require('../modals/ModifySchema');
const Reject =require('../modals/RejectSchema');

const User =require('../modals/User')



// for asking for a loan

router.post('/askloan',fetchUser,async (req,res)=>{
     
    const {amount ,tenure,interest_rate}=req.body;
    const tut= await User.findById(req.user.id);
    const asked_loan={
        user:req.user.id,
        name:tut.name,
        amount:amount,
        tenure:tenure,
        interest_rate:interest_rate,
    }
    const new_ask_loan=await new Ask(asked_loan);
    const saved_ask_loan= await new_ask_loan.save();
  return res.json({loan:saved_ask_loan});

})


/// for getting all asked loan
router.get('/getloans',fetchUser, (req,res)=>{
   const rejected_loan=[];
    const R= Reject.find({rejected_by:req.user.id}, function(err, loans){
        if(err){
            console.log(err);
            return res.status(500).send("Something Went Wrong");
        }
        else {
         loans.forEach(loan => {
             rejected_loan.push(loan);
         });
        }
    })

     const J=Ask.find({},(err,loans)=>{
      
        if(err){
            console.log(err);
            return res.status(500).send("Something Went Wrong");
        }
        else{
            const req_loans=[];
            loans.forEach(loan=>{
                var z=true;
                rejected_loan.forEach(rej=>{
                    if(rej.loan_id==loan.id) z=false;
                })

                if(!z || loan.accepted_by || loan.user==req.user.id ) {}
                else req_loans.push(loan);
            })

            return res.json(req_loans);
        }

     })


})



    

    router.get('/debitloans',fetchUser, (req,res)=>{
       
        const J= Ask.find({user:req.params.id,}, function(err, loans){
            if(err){
                console.log(err);
                return res.status(500).send("Something Went Wrong");
            }
            else {
                const com_loans=[];

             loans.forEach(element => {
                    if(element.accepted_by){
                        com_loans.push(element);
                    }
                });

                return res.json(com_loans);
            }})
        
        });

    //for getting taken loans

    router.get('/creditloans',fetchUser, (req,res)=>{
       
  
        const J= Ask.find({accepted_by:req.user.id}, function(err, loans){
            if(err){
                console.log(err);
                return res.status(500).send("Something Went Wrong");
            }
            else {
                return res.json(loans);
            }
        });
    

    //return res.json(loans);

})


/// for rejecting a loan
router.get('/reject/:id',fetchUser,async (req,res)=>{
      
    const reject_loan={
        loan_id:req.params.id,
        rejected_by:req.user.id
    }
    
    const rejected_loan= await new Reject(reject_loan);

    const saved_rejected_loan= await rejected_loan.save();

   return  res.json({status:"successfully rejected",loan:saved_rejected_loan});

})


// for accepting a loan
router.get('/accept/:id',fetchUser ,async (req,res)=>{
    // const tut= await User.findById(req.user.id);
    const tut={name:"mehul"};
   const update_loan= await Ask.findByIdAndUpdate(req.params.id,{$set:{accepted_by:req.user.id,accepted_name:tut.name}});

    const R=  await  Modify.findOneAndDelete({ask_id:req.params.id});
    const J=await Reject.findOneAndDelete({loan_id:req.params.id});

   return  res.json({status:"successfully accepted",loan:update_loan});

})


/// for modifying a loan

router.post('/modify/:id',fetchUser,async (req,res)=>{
   
    const loan=await Ask.findById(req.params.id);
   const {modify_tenure,modify_interest_rate}=req.body;
const asked_loan={};
   asked_loan.user=loan.user;
   asked_loan.name=loan.name;
   asked_loan.ask_id=loan.id;
   asked_loan.amount=loan.amount;
   asked_loan.tenure=loan.tenure;
   asked_loan.interest_rate=loan.interest_rate;
   asked_loan.modify_tenure=modify_tenure;
   asked_loan.modify_interest_rate=modify_interest_rate;
   asked_loan.modify_by=req.user.id;
   const tut= await User.findById(req.user.id);
   asked_loan.modify_by_name=tut.name;

   const new_modify_loan =await new Modify(asked_loan);

   const saved_modify_loan= await new_modify_loan.save();

   return res.json({satus:"successfully modified",loan:saved_modify_loan});

})


// for getting modified loan for a asked user

router.get('/askmodify',fetchUser,(req,res)=>{
      
    
    Modify.find({user:req.user.id},(err,loans)=>{
       if(err){
           return res.status(500).send("Something Went wrong");
       }
       else{
         return res.json({loans:loans});

       }


    })


})


// for geetting modified laon for a giving user

router.get('/givemodify',fetchUser,(req,res)=>{
      
    
    Modify.find({modify_by:req.user.id},(err,loans)=>{
       if(err){
           return res.status(500).send("Something Went wrong");
       }
       else{
         return res.json({loans:loans});
       }
    })
})

// accpeting modify loan
router.get('/modifyaccept/:id',fetchUser,async (req,res)=>{
      
     const modified_loan=await Modify.findById(req.params.id);
     const updating_loan={
         accepted_by:modified_loan.modify_by,
         accepted_name:modified_loan.modify_by_name,
         tenure:modified_loan.modify_tenure,
         interest_rate:modified_loan.modify_interest_rate
     }
    const update_loan= await Ask.findByIdAndUpdate(req.params.id,{$set:updating_loan});
 
     const R=  await  Modify.findOneAndDelete({ask_id:req.params.id});
     const J=await Reject.findOneAndDelete({loan_id:req.params.id});
 
    return  res.json({status:"successfully accepted",loan:update_loan});
 
 })


 //modify reject
 router.get('/modifyreject/:id',fetchUser,async (req,res)=>{
    const rejected_loan= await Reject.findByIdAndDelete(req.params.id);
   return  res.json({status:"successfully rejected",loan:rejected_loan});

})
 

module.exports=router;