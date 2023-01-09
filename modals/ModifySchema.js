const mongoose=require('mongoose');

const ModifySchema= new mongoose.Schema({
     user:String,
     name:String,
     ask_id:String,
     amount:Number,
     tenure:Number,
     interest_rate:Number,
     modify_tenure:Number,
     modify_interest_rate:Number,
     modify_by:String,
     modify_by_name:String
})




module.exports= mongoose.model('modify_loan', ModifySchema);