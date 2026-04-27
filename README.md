# 📊 Social Media Analytics Dashboard

![Project Banner](https://img.shields.io/badge/Project-Social%20Media%20Analytics-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)

> A full-stack Social Media Analytics Dashboard built as a DBMS group project.
> Track posts, likes, comments, shares and visualize engagement using beautiful charts.

---

## 🌐 Live Demo
- 🔗 **Live App:** https://social-media-dashboard-lk97.vercel.app
- ⚙️ **Backend API:** https://social-media-dashboard-lrbf.onrender.com
- 💻 **GitHub Repo:** https://github.com/tanvi-rao02/social-media-dashboard

---

## 🎯 Project Overview
This project is a Social Media Analytics Dashboard that allows users to:
- Register and Login securely using JWT Authentication
- View analytics like total posts, likes, comments and shares
- See the most liked post highlighted on dashboard
- Visualize data using Bar, Line and Pie charts
- Add new posts with engagement data
- Delete existing posts
- View user leaderboard based on total engagement
- Filter analytics by platform (Twitter, Instagram, LinkedIn, Facebook)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Chart.js, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MySQL (Railway) |
| Authentication | JWT + Bcrypt |
| Version Control | Git + GitHub |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 🗄️ Database Schema

### Tables
- **users** - id, name, email, password, created_at
- **posts** - id, user_id (FK), content, platform, created_at
- **engagement** - id, post_id (FK), likes, comments, shares, recorded_at

### DBMS Concepts Used
- ✅ Primary Key and Foreign Key
- ✅ Normalization (1NF, 2NF, 3NF)
- ✅ JOIN Queries (3 tables joined)
- ✅ Aggregate Functions (SUM, AVG, COUNT)
- ✅ Indexing for performance
- ✅ Referential Integrity (ON DELETE CASCADE)

---

## 📁 Project Structure
