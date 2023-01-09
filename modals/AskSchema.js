const mongoose=require('mongoose');

const AskSchema= new mongoose.Schema({

     user:String,
     name:String,
     amount:Number,
     tenure:Number,
     interest_rate:Number,
     accepted_by:String,
     accepted_name:String
})




module.exports= mongoose.model('ask_loan',AskSchema);