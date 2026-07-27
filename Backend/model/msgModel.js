const mongoose = require("mongoose")

const msgSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    file: {
        filename: String, 
        path: String,          
        mimetype: String,      
        size: Number,         
    }
}, {
    timestamps: true
})

const msgModel = mongoose.model("Message", msgSchema)

module.exports = msgModel