const mongoose=require('mongoose');

// name: "",
// email: "",
// phone: "",
// password: ""

const userSchema=mongoose.Schema({
    name:{
        type: String,
        required: ["name is required", true],
        trim: true
    },
    email:{
        type: String,
        required:["email is required", true],
        unique: true,
        trim: true,
        lowercase: true
    },
    phone:{
        type: Number,
        required:["phone number is required", true],
        trim: true,
    },
    password:{
        type: String,
        required:["Password is required", true],
        trim: true
    }

},{timestamps: true})

module.exports=mongoose.model('Users',userSchema);