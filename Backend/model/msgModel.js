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
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "groups",
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
    },
}, {
    timestamps: true
})

msgSchema.pre("validate", function () {
    if (!this.to && !this.group) {
        throw new Error("Message must have either a `to` (user) or `group` recipient.");
    }
    if (this.to && this.group) {
        throw new Error("Message cannot have both `to` and `group` set.");
    }
});

const msgModel = mongoose.model("Message", msgSchema)

module.exports = msgModel