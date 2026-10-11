import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true
    },

    messages: [messageSchema],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model("Chat", chatSchema);