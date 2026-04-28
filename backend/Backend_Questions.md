# Backend Interview & Technical Questions

A comprehensive list of viva-ready questions covering the entire backend codebase for the Social Media Analytics Dashboard.

---

## 1. General Architecture & Project Setup

### Q1. What is the overall architecture of this backend application?
**Ans:** It is a modular REST API built with **Node.js** and **Express.js**. It follows a layered structure:
- **Entry Point (`server.js`)**: Initializes the Express app, configures global middleware (CORS, body-parser), mounts route modules, and starts the server.
- **Database Layer (`db.js`)**: Manages a MySQL connection pool using `mysql2/promise`.
- **Route Modules (`routes/`)**: Handle specific business domains—`auth.js` for authentication, `posts.js` for post CRUD, and `analytics.js` for data aggregation.
- **Environment Config**: Uses `dotenv` to load sensitive credentials and configuration from a `.env` file.

### Q2. What is the purpose of `package.json` in this project?
**Ans:** It defines the project metadata, entry script (`server.js`), and dependencies. Key runtime dependencies include:
- `express` for the web framework.
- `mysql2` for database connectivity.
- `bcryptjs` for password hashing.
- `jsonwebtoken` for stateless authentication.
- `cors`, `body-parser`, and `dotenv` for middleware and configuration.
Dev dependency `nodemon` is used for auto-restarting the server during development via `npm run dev`.

### Q3. What does the `type: "commonjs"` field signify?
**Ans:** It explicitly tells Node.js to treat `.js` files as CommonJS modules (using `require()` and `module.exports`) rather than ES Modules. This is the default behavior, but setting it ensures consistency and avoids issues if the project scope changes later.

### Q4. What are the available npm scripts and their purposes?
**Ans:**
- `npm start` → Runs `node server.js` (production).
- `npm run dev` → Runs `nodemon server.js` (development with auto-reload).

---

## 2. Server Configuration & Middleware (`server.js`)

### Q5. How is the Express application initialized?
**Ans:**
```js
const express = require('express');
const app = express();
```
The app is created, middleware is attached using `app.use()`, routes are mounted at specific paths, and the server listens on `process.env.PORT || 5000`.

### Q6. What is the role of `body-parser` in this application?
**Ans:** `body-parser` parses incoming request bodies before handlers access them.
- `bodyParser.json()` parses JSON payloads (`Content-Type: application/json`).
- `bodyParser.urlencoded({ extended: true })` parses URL-encoded data, allowing rich objects and arrays.

### Q7. Why is `dotenv` used, and where is it imported?
**Ans:** `dotenv` loads environment variables from a `.env` file into `process.env`. It is required at the top of `server.js`, `db.js`, `posts.js`, and `analytics.js` so that values like `JWT_SECRET`, `DB_HOST`, and `PORT` are available application-wide.

### Q8. How are routes organized and mounted in the application?
**Ans:** Routes are split into separate modules under `routes/`. They are imported into `server.js` and mounted on specific base paths using `app.use()`:
```js
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
```
This creates clean, RESTful endpoints like `/api/auth/register` and `/api/posts/:id`.

### Q9. What is the purpose of the health check endpoint (`GET /`)?
**Ans:** It provides a quick way to verify that the API is alive and responding. It returns a JSON message confirming the API status and version, which is useful for monitoring, deployment verification, and frontend connectivity checks.

### Q10. Explain the global error handler at the bottom of `server.js`.
**Ans:**
```js
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});
```
This is an Express error-handling middleware (4 arguments). It catches any unhandled errors thrown in synchronous or asynchronous routes (if forwarded with `next(err)`), logs the stack trace on the server, and sends a generic 500 response to the client to prevent leaking internal details.

---

## 3. CORS Configuration

### Q11. What is CORS, and why is it configured in this backend?
**Ans:** **Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page. Since the frontend runs on `localhost:3000` (or a deployed Vercel domain) and the backend on `localhost:5000`, CORS must be explicitly enabled to allow the browser to communicate with the API.

### Q12. What specific CORS settings are applied?
**Ans:**
```js
app.use(cors({
    origin: ['http://localhost:3000', 'https://social-media-dashboard-lk97.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
```
- **`origin`**: Whitelist of allowed frontend domains.
- **`methods`**: Permitted HTTP methods.
- **`allowedHeaders`**: Permitted headers (essential for JWT in `Authorization`).
- **`credentials: true`**: Allows cookies/auth headers to be sent across origins.

### Q13. What would happen if `credentials: true` was omitted?
**Ans:** The browser would block cookies, authorization headers, and TLS client certificates from being sent with cross-origin requests. Since this app uses `Authorization: Bearer <token>` headers, the backend would receive requests without the token, causing all protected routes to return 401 Unauthorized.

---

## 4. Database Layer (`db.js`)

### Q14. Which database and driver are used?
**Ans:** **MySQL** is used as the relational database, and **`mysql2`** is the Node.js driver. `mysql2` is chosen over `mysql` because it supports **Promise-based APIs** (`pool.promise()`), async/await syntax, and prepared statements.

### Q15. Why is a connection pool used instead of a single connection?
**Ans:** A connection pool (`mysql.createPool`) maintains a cache of database connections that can be reused across multiple requests. Benefits include:
- **Performance**: Eliminates the overhead of opening/closing connections per request.
- **Concurrency**: Multiple requests can be handled simultaneously up to the `connectionLimit`.
- **Stability**: `waitForConnections: true` queues requests if all connections are busy, preventing crashes.

### Q16. What is `promisePool`, and how is it used?
**Ans:** `const promisePool = pool.promise();` wraps the pool in a Promise-compatible interface. This allows the use of `async/await` instead of callbacks throughout the route handlers:
```js
const [rows] = await db.query('SELECT ...', [params]);
```

### Q17. What does `connectionLimit: 10` mean?
**Ans:** It sets the maximum number of simultaneous connections the pool will create to MySQL. If all 10 are in use, additional queries wait in a queue (`queueLimit: 0` means unlimited queue size).

### Q18. How does `db.js` verify connectivity on startup?
**Ans:**
```js
pool.getConnection((err, connection) => {
    if (err) { /* log error */ return; }
    console.log('✅ Connected to MySQL database');
    connection.release();
});
```
It grabs one connection from the pool, logs success, and immediately releases it back to the pool. This confirms that credentials and network settings are correct without keeping an unnecessary persistent connection open.

### Q19. Can you infer the database schema based on the queries used?
**Ans:** Yes, at least three tables exist:
1. **`users`**
   - `id` (PK, auto-increment)
   - `name`
   - `email` (unique)
   - `password` (hashed)
2. **`posts`**
   - `id` (PK, auto-increment)
   - `user_id` (FK → `users.id`)
   - `content`
   - `platform`
   - `created_at` (default `CURRENT_TIMESTAMP`)
3. **`engagement`**
   - `post_id` (FK → `posts.id`)
   - `likes`
   - `comments`
   - `shares`

---

## 5. Authentication & Authorization (`auth.js`)

### Q20. How does user registration work?
**Ans:**
1. Validates that `name`, `email`, and `password` are present.
2. Checks if the email already exists using a parameterized query.
3. Hashes the password using `bcrypt.hash(password, 10)` (10 salt rounds).
4. Inserts the new user into the `users` table.
5. Returns `201 Created` with a success message and the new `userId`.

### Q21. Why is `bcryptjs` used instead of storing plain-text passwords?
**Ans:** Storing plain-text passwords is a severe security risk. `bcryptjs` applies a one-way hashing algorithm with a salt to make passwords irreversible. Even if the database is compromised, attackers cannot easily recover original passwords. The salt rounds (10) determine the computational cost, making brute-force attacks expensive.

### Q22. How does the login flow authenticate a user?
**Ans:**
1. Retrieves the user by email.
2. If no user is found, returns `401 Unauthorized` (prevents email enumeration to some extent).
3. Compares the submitted password with the stored hash using `bcrypt.compare()`.
4. If valid, generates a JWT containing `id`, `name`, and `email`.
5. Returns the token and user details to the client.

### Q23. What is a JWT, and how is it configured here?
**Ans:** **JSON Web Token (JWT)** is a compact, URL-safe token used for stateless authentication. It is generated using:
```js
jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```
- **Payload**: User identity claims.
- **Secret**: A server-side secret (`JWT_SECRET`) used to sign the token.
- **Expiry**: Token becomes invalid after 24 hours, reducing the window of misuse if stolen.

### Q24. What is the difference between the 400, 401, 403, 409, and 500 status codes used in `auth.js`?
**Ans:**
- **`400 Bad Request`**: Missing required fields (client error).
- **`401 Unauthorized`**: Invalid credentials during login.
- **`403 Forbidden`**: Used in other routes for insufficient permissions (e.g., deleting someone else's post).
- **`409 Conflict`**: Email already exists during registration.
- **`500 Internal Server Error`**: Unexpected server/database errors.

---

## 6. JWT Verification Middleware (`verifyToken`)

### Q25. How does the `verifyToken` middleware work?
**Ans:**
1. Reads the `Authorization` header.
2. Extracts the token after the `Bearer ` prefix: `authHeader.split(' ')[1]`.
3. If no token is present, returns `401`.
4. Verifies the token using `jwt.verify(token, process.env.JWT_SECRET)`.
5. If valid, attaches the decoded payload (`req.user`) and calls `next()`.
6. If invalid or expired, returns `403`.

### Q26. Why is the decoded user object attached to `req.user`?
**Ans:** Attaching the decoded payload to the request object makes the authenticated user's identity available to downstream route handlers. For example, `req.user.id` is used in `posts.js` to associate a new post with its creator or to authorize deletions.

### Q27. Why return `401` for missing tokens and `403` for invalid tokens?
**Ans:** This follows HTTP semantics:
- **`401 Unauthorized`**: Authentication is required but was not provided.
- **`403 Forbidden`**: Authentication was provided but is invalid, expired, or insufficient.

### Q28. Is `verifyToken` duplicated in `posts.js` and `analytics.js`? How can this be improved?
**Ans:** Yes, the same function is repeated in both files. This violates DRY (Don't Repeat Yourself). The recommended improvement is to create a `middleware/authMiddleware.js` file, export `verifyToken` from it, and import it into any route module that needs protection.

---

## 7. REST API Design — Posts (`posts.js`)

### Q29. What RESTful operations are implemented for posts?
**Ans:**
- **`GET /api/posts/`** → Retrieve all posts with engagement stats (Read).
- **`POST /api/posts/`** → Create a new post with engagement (Create).
- **`DELETE /api/posts/:id`** → Delete a post by ID (Delete).
There is no explicit Update (`PUT/PATCH`) endpoint implemented.

### Q30. How is the `GET /api/posts` query structured, and why are `LEFT JOIN` and `COALESCE` used?
**Ans:**
```sql
SELECT p.id, p.content, p.platform, p.created_at, u.name AS author, ...
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN engagement e ON p.id = e.post_id
ORDER BY p.created_at DESC
```
- **`JOIN users`**: Inner join ensures every post has an associated author.
- **`LEFT JOIN engagement`**: Ensures posts without engagement records are still returned. Without `LEFT`, such posts would be filtered out.
- **`COALESCE(e.likes, 0)`**: Converts `NULL` (when no engagement row exists) to `0` for cleaner JSON output.

### Q31. How is a post created, and how are engagements handled?
**Ans:**
1. Validates that `content` is present.
2. Inserts into `posts` table with `user_id` from `req.user.id`.
3. Uses `postResult.insertId` to insert a corresponding row into the `engagement` table in the same handler.
4. Returns `201 Created` with the new `postId`.

### Q32. How is authorization enforced for deleting a post?
**Ans:**
```js
const [post] = await db.query('SELECT user_id FROM posts WHERE id = ?', [postId]);
if (post[0].user_id !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
}
```
The server verifies that the `user_id` of the post matches the `id` of the authenticated user. Only the original author can delete their post.

### Q33. What happens if a user tries to delete a non-existent post?
**Ans:** The query returns an empty array. The code checks `post.length === 0` and returns `404 Not Found` before attempting deletion.

---

## 8. REST API Design — Analytics (`analytics.js`)

### Q34. What is the purpose of the analytics module?
**Ans:** It provides aggregated data for the frontend dashboard charts and summary cards. It performs complex SQL aggregation queries across `posts`, `users`, and `engagement` tables.

### Q35. What does `/api/analytics/summary` return?
**Ans:** Two query results combined:
1. **`totals`**: Overall counts (posts, users, likes, comments, shares, total engagement, averages).
2. **`topPost`**: The single post with the highest likes, including content, platform, author, and engagement numbers.

### Q36. How does `/api/analytics/by-platform` work?
**Ans:** It groups posts by `platform`, aggregates engagement metrics per platform, and orders by total engagement descending. This powers a pie/bar chart showing which social media platform performs best.

### Q37. What SQL technique is used in `/api/analytics/top-posts` to create labels?
**Ans:**
```sql
CONCAT(LEFT(p.content, 30), '...') AS label
```
This truncates post content to 30 characters and appends `...` for concise chart labels without exposing full post text.

### Q38. How does `/api/analytics/over-time` prepare data for line charts?
**Ans:**
```sql
SELECT DATE(p.created_at) AS date, SUM(e.likes) AS likes, ...
FROM posts p
JOIN engagement e ON p.id = e.post_id
GROUP BY DATE(p.created_at)
ORDER BY date ASC
```
It buckets engagement by calendar date, summing likes/comments/shares per day—ideal for time-series line charts.

### Q39. Explain the `/api/analytics/leaderboard` query.
**Ans:**
```sql
SELECT u.name, COUNT(p.id) AS total_posts, SUM(e.likes) AS total_likes, ...
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN engagement e ON p.id = e.post_id
GROUP BY u.id, u.name
ORDER BY total_engagement DESC
```
It ranks users by total engagement across all their posts, showing metrics like post count, likes, and interactions. This drives a leaderboard table on the dashboard.

### Q40. Why are `JOIN` and `LEFT JOIN` chosen differently across analytics endpoints?
**Ans:**
- **`LEFT JOIN`** is used when the metric should include records even if engagement data is missing (e.g., summary counts).
- **`JOIN` (INNER)** is used when both sides must exist for the result to make sense (e.g., top posts, over-time, leaderboard), ensuring only posts with engagement are aggregated.

---

## 9. SQL & Query Optimization

### Q41. Why are parameterized queries (`?`) used everywhere?
**Ans:** Parameterized queries prevent **SQL Injection** attacks. By separating SQL logic from data, malicious input like `' OR '1'='1` is treated as a literal value rather than executable SQL. `mysql2` automatically escapes parameters when using `?` placeholders.

### Q42. What is `COALESCE`, and why is it important here?
**Ans:** `COALESCE(value1, value2, ...)` returns the first non-NULL value. In this app, it ensures that posts without engagement records return `0` instead of `NULL`, so the frontend receives numeric values suitable for display and arithmetic.

### Q43. What database indexes would you recommend for this schema?
**Ans:**
- **`users.email`**: Unique index for fast login lookups and duplicate prevention.
- **`posts.user_id`**: Foreign key index for joins and filtering by author.
- **`posts.created_at`**: Index for sorting posts chronologically.
- **`engagement.post_id`**: Foreign key index for fast joins with `posts`.
- **Composite index on `engagement(likes, comments, shares)`**: Potentially speeds up aggregation queries.

### Q44. How would you optimize the analytics queries if the dataset grows to millions of rows?
**Ans:**
- Add indexes on join columns and `GROUP BY` fields.
- Pre-compute daily/weekly summaries in a separate `analytics_cache` table using a cron job or triggers.
- Use materialized views if using a database that supports them.
- Implement pagination on leaderboard and post lists.
- Use read replicas for analytics queries to offload the primary database.

---

## 10. Error Handling & Best Practices

### Q45. How are errors handled in the route handlers?
**Ans:** Each route is wrapped in a `try...catch` block. Errors are logged to the console with a contextual prefix (e.g., `'Register error:'`), and the client receives a generic `500 Internal Server Error` with a safe message. This prevents leaking sensitive error details (like SQL syntax) to the client.

### Q46. What is a drawback of the current error handling?
**Ans:** The generic 500 responses do not distinguish between different failure types (e.g., database timeout vs. syntax error), making client-side debugging harder. Additionally, not all errors are forwarded to the global Express error handler with `next(err)`.

### Q47. How would you improve error handling across the backend?
**Ans:**
- Create custom error classes (`ValidationError`, `AuthenticationError`, `NotFoundError`) extending `Error`.
- Use an async error wrapper (or Express 5's built-in async support) to automatically catch async errors and forward them to a centralized error handler.
- Include structured error codes in the JSON response for programmatic handling on the frontend.

### Q48. Are there any input sanitization or validation mechanisms?
**Ans:** Basic validation exists:
- Check for missing required fields (`name`, `email`, `password`, `content`).
- Check for duplicate emails.
However, there is no explicit sanitization library (like `express-validator` or `Joi`), and no length/format checks for email or password strength.

### Q49. What security improvements would you suggest?
**Ans:**
- Add `express-rate-limit` to prevent brute-force attacks on login.
- Implement `helmet.js` to set secure HTTP headers.
- Use `express-validator` for strict input validation and sanitization.
- Enforce strong password policies (minimum length, complexity).
- Rotate `JWT_SECRET` periodically and implement a token blacklist for logout.
- Store tokens in HTTP-only cookies instead of `localStorage` to mitigate XSS.

---

## 11. Environment Variables & Deployment

### Q50. What environment variables are likely present in `.env`?
**Ans:** Based on usage across the codebase:
- `PORT`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `JWT_SECRET`

### Q51. Why is `.env` added to `.gitignore`?
**Ans:** `.env` contains sensitive secrets (database passwords, JWT keys). Adding it to `.gitignore` prevents accidental exposure in version control, which is a critical security practice.

### Q52. How would you deploy this backend to a production environment?
**Ans:**
1. **Environment**: Set `NODE_ENV=production` and configure production database credentials.
2. **Process Manager**: Use `pm2` or `systemd` to keep the Node.js process alive and manage restarts.
3. **Reverse Proxy**: Place Nginx or Apache in front to handle SSL termination, static compression, and load balancing.
4. **Database**: Use a managed MySQL service (AWS RDS, Google Cloud SQL) with automated backups.
5. **Security**: Enable firewalls, restrict database access to backend IPs, and use HTTPS only.
6. **Monitoring**: Integrate logging (Winston/Pino) and health checks.

---

## 12. Advanced / Bonus Questions

### Q53. How would you implement a logout feature?
**Ans:** Since JWTs are stateless, standard logout on the backend requires maintaining a **token blacklist** (e.g., in Redis or a database table) storing invalidated tokens until their natural expiry. On each protected request, the server checks the token against the blacklist. Alternatively, use short-lived access tokens with refresh tokens.

### Q54. How would you add pagination to the posts list?
**Ans:** Modify `GET /api/posts` to accept `?page` and `?limit` query parameters, then use SQL `LIMIT` and `OFFSET`:
```sql
SELECT ... FROM posts ... ORDER BY created_at DESC LIMIT ? OFFSET ?
```
Calculate `OFFSET = (page - 1) * limit`.

### Q55. How would you implement role-based access control (RBAC)?
**Ans:**
1. Add a `role` column to the `users` table (e.g., `user`, `admin`, `moderator`).
2. Include `role` in the JWT payload.
3. Create middleware `requireRole(role)` that checks `req.user.role` before allowing access to sensitive routes (like viewing all users or moderating content).

### Q56. How would you handle file uploads (e.g., images for posts)?
**Ans:** Use a middleware like **`multer`** to handle multipart/form-data. Store files locally during development or upload them to cloud storage (AWS S3, Cloudinary). Save the file URL in the database `posts` table (e.g., `media_url` column).

### Q57. How would you add caching to improve analytics performance?
**Ans:**
- Use **Redis** to cache expensive aggregation results with a TTL (e.g., 5 minutes).
- Cache keys can be named `analytics:summary`, `analytics:by-platform`, etc.
- Invalidate or update the cache whenever a new post is created or engagement is updated.

### Q58. How would you write unit tests for these routes?
**Ans:** Use **Jest** with **`supertest`**:
- Spin up the Express app in a test environment with a test database.
- Mock `bcrypt` and `jwt` where appropriate.
- Test success paths (200, 201) and failure paths (400, 401, 404, 500).
- Use `beforeAll`/`afterAll` to seed and clean the test database.

### Q59. How does this backend scale horizontally?
**Ans:**
- The app is stateless (JWT auth, no server-side sessions), so multiple Node.js instances can run behind a load balancer.
- The database connection pool should be tuned based on instance count.
- A central caching layer (Redis) and shared storage (S3) would be needed if file uploads or sessions are introduced.

### Q60. What is the difference between `mysql` and `mysql2`, and why was `mysql2` chosen?
**Ans:**
- **`mysql2`** supports Promises natively (`pool.promise()`), offers faster prepared statement execution, and includes better support for modern MySQL features.
- **`mysql`** relies heavily on callbacks. Since this codebase uses `async/await` extensively, `mysql2` is the natural and cleaner choice.

---

*Generated for the Social Media Analytics Dashboard Backend*

