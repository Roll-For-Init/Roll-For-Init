const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotificationSchema = new Schema({
    for: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        require: true,
        default: "Untitled Notification",
    },
    message: {
        type: String,
        require: true,
        default: "Empty message.",
    },
    content: {},
    read: {
        type: Boolean,
        require: true,
        default: false,
    },
    resolved: {
        type: Boolean,
        require: true,
        default: false,
    },
}, {
  timestamps: true
})

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
