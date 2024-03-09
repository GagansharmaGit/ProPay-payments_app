const mongoose = require("mongoose")


mongoose.connect('mongodb://localhost:27017/paytmm')
.then(()=>console.log("DataBase Connected"))
.catch((error)=> console.log(error))


//creating userSchema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:50,
    },
    password:{
        type:String,
        require:true,
        minLength:6,
    },
    firstname:{
        type:String,
        require:true,
        trim:true,
        maxLength:50,
    },
    lastname:{
        type:String,
        require:true,
        maxLength:50,
    }
})


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

// creating model from schema
const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);


// exporting module
module.exports={
    User,
    Account
}