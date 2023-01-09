
const mongoose=require('mongoose');

const ProfileSchema= new mongoose.Schema({
    user:String,

    aadhar_card:String,
    pan_card:String,
    salary_slip:String,
    name:String,
    bank_name:String,
    ifsc_code:String,
    account_number:Number,
    phone_number:Number,
    ctc:Number
})

module.exports= mongoose.model('profile',ProfileSchema);

