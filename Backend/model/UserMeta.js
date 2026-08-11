const mongoose = require("mongoose")

const metaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },
    lastOnline: {
        type: Date,
        default: null
    },
    number_of_unreadMsg: {
        type: Map,
        of: Number,
        default: {}
    },
    lastUnread: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const metaModel = mongoose.model("UserMeta", metaSchema);

module.exports = metaModel;