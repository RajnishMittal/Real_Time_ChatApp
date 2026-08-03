const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
    grpName:{
        required:true,
        type:String
    },
    grpPic:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?_=20200418092106"
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
}, {timestamps:true})

const groupModel = mongoose.model("groups", groupSchema)

module.exports = groupModel