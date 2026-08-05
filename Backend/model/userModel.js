const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    pass:{
        required:true,
        type:String,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    profilePic:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?_=20200418092106"
    },
    username:{
        type:String,
        default:null,
        unique:true,
        minlength: [8, "Username must be at least 8 characters long"],
        match: [/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"],
    },
    bio:{
        type:String,
        default: "Available on LinkSync."
    },
    dob:{
        type:Date,
        default:null
    },
    country:{
        type:String,
        default:null
    },
    state:{
        type:String,
        default:null
    }
}, {timestamps:true})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel