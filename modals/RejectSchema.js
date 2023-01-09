const mongoose=require('mongoose');

const RejectSchema= new mongoose.Schema({
       loan_id:String,
       rejected_by:String
})


module.exports= mongoose.model('reject_loan', RejectSchema);