const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    author: { type: String, default: 'Anonymous' },
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    author: { type: String, default: 'Anonymous' },
    votes: { type: Number, default: 0 },
    replies: [ReplySchema],
    answered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

PostSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Post', PostSchema);
