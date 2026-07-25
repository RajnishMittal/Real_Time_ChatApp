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
        required: true,
        trim: true,
    },
}, {
    timestamps: true
})

const msgModel = mongoose.model("Message", msgSchema)

module.exports = msgModel