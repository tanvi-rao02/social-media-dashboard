// analytics.js - Provides analytics data
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// SUMMARY STATS
router.get('/summary', verifyToken, async (req, res) => {
    try {
       const [[totals]] = await db.query(`
    SELECT 
        COUNT(DISTINCT p.id) AS total_posts,
        COUNT(DISTINCT p.user_id) AS total_users,
        SUM(e.likes) AS total_likes,
        SUM(e.comments) AS total_comments,
        SUM(e.shares) AS total_shares,
        SUM(e.reposts) AS total_reposts,
        SUM(e.likes + e.comments + e.shares + e.reposts) 
        AS total_engagement,
        AVG(e.likes) AS avg_likes,
        AVG(e.reposts) AS avg_reposts
    FROM posts p
    LEFT JOIN engagement e ON p.id = e.post_id
`);

        const [[topPost]] = await db.query(`
            SELECT p.content, p.platform, u.name, e.likes, e.comments, e.shares
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN engagement e ON p.id = e.post_id
            ORDER BY e.likes DESC
            LIMIT 1
        `);

        res.json({ totals, topPost });

    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({ message: 'Error fetching summary' });
    }
});

// BY PLATFORM
router.get('/by-platform', verifyToken, async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                p.platform,
                COUNT(p.id) AS post_count,
                SUM(e.likes) AS total_likes,
                SUM(e.comments) AS total_comments,
                SUM(e.shares) AS total_shares,
                SUM(e.likes + e.comments + e.shares) AS total_engagement
            FROM posts p
            LEFT JOIN engagement e ON p.id = e.post_id
            GROUP BY p.platform
            ORDER BY total_engagement DESC
        `);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platform data' });
    }
});

// TOP POSTS
router.get('/top-posts', verifyToken, async (req, res) => {
    try {
        const [data] = await db.query(`
    SELECT 
        CONCAT(LEFT(p.content, 30), '...') AS label,
        e.likes,
        e.comments,
        e.shares,
        e.reposts,
        (e.likes + e.comments + e.shares + e.reposts) AS total
    FROM posts p
    JOIN engagement e ON p.id = e.post_id
    ORDER BY total DESC
    LIMIT 6
`);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top posts' });
    }
});

// OVER TIME
router.get('/over-time', verifyToken, async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                DATE(p.created_at) AS date,
                SUM(e.likes) AS likes,
                SUM(e.comments) AS comments,
                SUM(e.shares) AS shares
            FROM posts p
            JOIN engagement e ON p.id = e.post_id
            GROUP BY DATE(p.created_at)
            ORDER BY date ASC
        `);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching time data' });
    }
});

// LEADERBOARD
router.get('/leaderboard', verifyToken, async (req, res) => {
    try {
        const [data] = await db.query(`
    SELECT 
        u.name,
        COUNT(p.id) AS total_posts,
        SUM(e.likes) AS total_likes,
        SUM(e.reposts) AS total_reposts,
        SUM(e.likes + e.comments + e.shares + e.reposts) 
        AS total_engagement
    FROM users u
    JOIN posts p ON u.id = p.user_id
    JOIN engagement e ON p.id = e.post_id
    GROUP BY u.id, u.name
    ORDER BY total_engagement DESC
`);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;
