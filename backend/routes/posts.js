// posts.js - Handles post operations
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// GET ALL POSTS
router.get('/', verifyToken, async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT 
                p.id,
                p.content,
                p.platform,
                p.created_at,
                u.name AS author,
                COALESCE(e.likes, 0) AS likes,
                COALESCE(e.comments, 0) AS comments,
                COALESCE(e.shares, 0) AS shares,
                COALESCE(e.reposts, 0) AS reposts,
                COALESCE(e.likes + e.comments + e.shares + e.reposts, 0) 
                AS total_engagement
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN engagement e ON p.id = e.post_id
            ORDER BY p.created_at DESC
        `);

        res.json({ posts, total: posts.length });

    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// CREATE A POST
router.post('/', verifyToken, async (req, res) => {
    try {
        const { 
            content, platform,
            likes, comments, shares, reposts  // ADD reposts
        } = req.body;

        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ 
                message: 'Content is required' 
            });
        }

        const [postResult] = await db.query(
            'INSERT INTO posts (user_id, content, platform) VALUES (?, ?, ?)',
            [userId, content, platform || 'general']
        );

        await db.query(
            `INSERT INTO engagement 
             (post_id, likes, comments, shares, reposts) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                postResult.insertId,
                likes || 0,
                comments || 0,
                shares || 0,
                reposts || 0   // ADD reposts
            ]
        );

        res.status(201).json({
            message: 'Post created successfully',
            postId: postResult.insertId
        });

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ 
            message: 'Error creating post' 
        });
    }
});


// DELETE A POST
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;

        const [post] = await db.query(
            'SELECT user_id FROM posts WHERE id = ?',
            [postId]
        );

        if (post.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await db.query('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

module.exports = router;
