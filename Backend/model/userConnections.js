const mongoose = require("mongoose")

const usersSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },

    blocked_user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    account_private: {
        type:Boolean,
        default:false
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    groupJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups"
    }],
}, { timestamps: true })

const connectionsModel = mongoose.model("usersConnections", usersSchema)

module.exports = connectionsModel