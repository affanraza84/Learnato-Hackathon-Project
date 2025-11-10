const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

module.exports = (io) => {
    const socketUtils = require('../utils/socket');

    router.post('/', async (req, res) => {
        try {
            const { title, content, author } = req.body;
            const post = new Post({ title, content, author });
            await post.save();
            socketUtils.emitNewPost(io, post);
            res.status(201).json(post);
        } catch (err) {
            console.log("Post Error : ", err);
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const sort = req.query.sort === 'votes' ? { votes: -1 } : { createdAt: -1 };
            const posts = await Post.find().sort(sort).lean();
            res.json(posts);
        } catch (err) {
            console.log("Get error : ", err);
            res.status(500).json({ error: err.message });
        }
    });


    router.get('/:id', async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).lean();
            if (!post) return res.status(404).json({ error: 'Not found' });
            res.json(post);
        } catch (err) {
            console.log("Get error : ", err);
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/:id/reply', async (req, res) => {
        try {
            const { author, content } = req.body;
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Not found' });
            const reply = { author: author || 'Anonymous', content };
            post.replies.push(reply);
            await post.save();
            socketUtils.emitNewReply(io, { postId: post._id, reply });
            res.json({ postId: post._id, reply });
        } catch (err) {
            console.log("Post error : ", err);
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/:id/upvote', async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Not found' });
            post.votes += 1;
            await post.save();
            socketUtils.emitUpdatedPost(io, post);
            res.json({ votes: post.votes });
        } catch (err) {
            console.log("Post error :", err);
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/:id/answer', async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ error: 'Not found' });
            post.answered = true;
            await post.save();
            socketUtils.emitUpdatedPost(io, post);
            res.json(post);
        } catch (err) {
            console.log("Post error : ", err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
