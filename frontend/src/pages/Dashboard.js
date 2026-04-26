import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
    CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend
);

const API = 'https://social-media-dashboard-lrbf.onrender.com/api';

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const [summary, setSummary] = useState(null);
    const [topPost, setTopPost] = useState(null);
    const [platformData, setPlatformData] = useState([]);
    const [topPosts, setTopPosts] = useState([]);
    const [overTime, setOverTime] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({
        content: '', platform: 'twitter',
        likes: '', comments: '', shares: ''
    });

    const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

    // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
    fetchAllData();
}, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [summaryRes, platformRes, topPostsRes, overTimeRes, leaderRes, postsRes] =
                await Promise.all([
                    axios.get(`${API}/analytics/summary`, axiosConfig),
                    axios.get(`${API}/analytics/by-platform`, axiosConfig),
                    axios.get(`${API}/analytics/top-posts`, axiosConfig),
                    axios.get(`${API}/analytics/over-time`, axiosConfig),
                    axios.get(`${API}/analytics/leaderboard`, axiosConfig),
                    axios.get(`${API}/posts`, axiosConfig),
                ]);

            setSummary(summaryRes.data.totals);
            setTopPost(summaryRes.data.topPost);
            setPlatformData(platformRes.data);
            setTopPosts(topPostsRes.data);
            setOverTime(overTimeRes.data);
            setLeaderboard(leaderRes.data);
            setPosts(postsRes.data.posts);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                handleLogout();
            }
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/posts`, newPost, axiosConfig);
            setNewPost({ content: '', platform: 'twitter', likes: '', comments: '', shares: '' });
            fetchAllData();
            alert('Post added successfully!');
        } catch (error) {
            alert('Error adding post: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await axios.delete(`${API}/posts/${postId}`, axiosConfig);
            fetchAllData();
        } catch (error) {
            alert('Error deleting post');
        }
    };

    const barChartData = {
        labels: topPosts.map(p => p.label),
        datasets: [
            { label: 'Likes', data: topPosts.map(p => p.likes), backgroundColor: '#4f46e5' },
            { label: 'Comments', data: topPosts.map(p => p.comments), backgroundColor: '#10b981' },
            { label: 'Shares', data: topPosts.map(p => p.shares), backgroundColor: '#f59e0b' },
        ]
    };

    const lineChartData = {
        labels: overTime.map(d => d.date),
        datasets: [
            { label: 'Likes', data: overTime.map(d => d.likes), borderColor: '#4f46e5', tension: 0.4, fill: false },
            { label: 'Comments', data: overTime.map(d => d.comments), borderColor: '#10b981', tension: 0.4, fill: false },
            { label: 'Shares', data: overTime.map(d => d.shares), borderColor: '#f59e0b', tension: 0.4, fill: false },
        ]
    };

    const pieChartData = {
        labels: platformData.map(p => p.platform),
        datasets: [{
            data: platformData.map(p => p.total_engagement),
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        }]
    };

    if (loading) return <div className="loading">⏳ Loading dashboard...</div>;

    return (
        <div className="dashboard">
            <nav className="navbar">
                <h2>📊 Social Analytics Dashboard</h2>
                <div className="nav-right">
                    <span>👤 {user.name}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">

                <div className="cards-grid">
                    <div className="card blue">
                        <h3>Total Posts</h3>
                        <p>{summary?.total_posts || 0}</p>
                    </div>
                    <div className="card green">
                        <h3>Total Likes</h3>
                        <p>{Number(summary?.total_likes || 0).toLocaleString()}</p>
                    </div>
                    <div className="card orange">
                        <h3>Total Comments</h3>
                        <p>{Number(summary?.total_comments || 0).toLocaleString()}</p>
                    </div>
                    <div className="card purple">
                        <h3>Total Shares</h3>
                        <p>{Number(summary?.total_shares || 0).toLocaleString()}</p>
                    </div>
                </div>

                {topPost && (
                    <div className="top-post-banner">
                        <h3>🏆 Most Liked Post</h3>
                        <p>"{topPost.content}"</p>
                        <span>by {topPost.name} on {topPost.platform} — ❤️ {topPost.likes} likes</span>
                    </div>
                )}

                <div className="charts-grid">
                    <div className="chart-box">
                        <h3>📈 Top Posts Engagement</h3>
                        <Bar data={barChartData} options={{ responsive: true }} />
                    </div>
                    <div className="chart-box">
                        <h3>🥧 Engagement by Platform</h3>
                        <Pie data={pieChartData} options={{ responsive: true }} />
                    </div>
                </div>

                <div className="chart-box full-width">
                    <h3>📉 Engagement Over Time</h3>
                    <Line data={lineChartData} options={{ responsive: true }} />
                </div>

                <div className="leaderboard">
                    <h3>🏅 User Leaderboard</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Posts</th>
                                <th>Total Likes</th>
                                <th>Total Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user, i) => (
                                <tr key={i}>
                                    <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.total_posts}</td>
                                    <td>{Number(user.total_likes).toLocaleString()}</td>
                                    <td>{Number(user.total_engagement).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="add-post-form">
                    <h3>➕ Add New Post</h3>
                    <form onSubmit={handleAddPost}>
                        <textarea
                            placeholder="What did you post?"
                            value={newPost.content}
                            onChange={e => setNewPost({...newPost, content: e.target.value})}
                            required
                        />
                        <div className="form-row">
                            <select
                                value={newPost.platform}
                                onChange={e => setNewPost({...newPost, platform: e.target.value})}
                            >
                                <option value="twitter">Twitter</option>
                                <option value="instagram">Instagram</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="facebook">Facebook</option>
                            </select>
                            <input type="number" placeholder="Likes" min="0"
                                value={newPost.likes}
                                onChange={e => setNewPost({...newPost, likes: e.target.value})} />
                            <input type="number" placeholder="Comments" min="0"
                                value={newPost.comments}
                                onChange={e => setNewPost({...newPost, comments: e.target.value})} />
                            <input type="number" placeholder="Shares" min="0"
                                value={newPost.shares}
                                onChange={e => setNewPost({...newPost, shares: e.target.value})} />
                        </div>
                        <button type="submit">Add Post</button>
                    </form>
                </div>

                <div className="posts-table">
                    <h3>📋 All Posts</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Author</th>
                                <th>Content</th>
                                <th>Platform</th>
                                <th>Likes</th>
                                <th>Comments</th>
                                <th>Shares</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td>{post.author}</td>
                                    <td>{post.content.substring(0, 40)}...</td>
                                    <td><span className={`platform-badge ${post.platform}`}>{post.platform}</span></td>
                                    <td>❤️ {post.likes}</td>
                                    <td>💬 {post.comments}</td>
                                    <td>🔁 {post.shares}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="delete-btn"
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
