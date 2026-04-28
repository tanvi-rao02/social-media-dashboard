# Frontend Interview & Technical Questions

A comprehensive list of questions covering the entire frontend codebase for the Social Media Analytics Dashboard.

---

## 1. General Architecture & Project Setup

1. What is the overall architecture of this frontend application?
2. What build tool is being used, and what are its key scripts?
3. What is the significance of `React.StrictMode` in `index.js`?
4. Why is `reportWebVitals` included in the project?
5. What is the purpose of the `browserslist` configuration in `package.json`?
6. What testing libraries are included, and what are their roles?
7. How would you describe the component hierarchy of this application?
8. What version of React is being used, and what new features does it bring?

---

## 2. Routing & Navigation (App.js)

1. What routing library is used, and how is it configured?
2. How does `BrowserRouter` differ from `HashRouter`?
3. What is the purpose of the `PrivateRoute` component?
4. How does `PrivateRoute` check if a user is authenticated?
5. What happens if an unauthenticated user tries to access `/dashboard`?
6. What is the difference between `Navigate` and `useNavigate`?
7. What route does the root path (`/`) redirect to?
8. How would you implement role-based routing in this application?
9. What are the potential drawbacks of using `localStorage` for auth state in `PrivateRoute`?
10. How would you handle a token expiration scenario in the routing logic?

---

## 3. Authentication & Login Page (Login.js)

1. What state management approach is used in the Login component?
2. What is the purpose of the `isRegister` state variable?
3. How is form data managed in the Login component?
4. What happens when a user submits the registration form?
5. What happens when a user submits the login form?
6. Where is the authentication token stored after a successful login?
7. Where is the user information stored after a successful login?
8. What is the purpose of the `loading` state?
9. How are error messages displayed to the user?
10. What is the API base URL, and where is it defined?
11. How does the component handle network errors from the API?
12. What is the purpose of `e.preventDefault()` in the form submission?
13. How would you implement form validation in this component?
14. What security concerns exist with storing the token in `localStorage`?
15. How would you implement "Remember Me" functionality?
16. What is the purpose of the `handleChange` function?
17. How does the component toggle between login and register modes?
18. What happens to the `name` field when switching from register to login mode?
19. How would you add a "Forgot Password" feature to this page?
20. What accessibility improvements could be made to the login form?

---

## 4. Dashboard & Data Visualization (Dashboard.js)

### 4.1 General Dashboard
1. What is the purpose of the Dashboard component?
2. How does the Dashboard component retrieve the current user's information?
3. What happens if the user is not authenticated when accessing the Dashboard?
4. What is the purpose of the `axiosConfig` object?
5. How is the `Authorization` header formatted for API requests?

### 4.2 Data Fetching
1. What hook is used to fetch data when the component mounts?
2. What is the purpose of `Promise.all` in `fetchAllData`?
3. What API endpoints are called to populate the dashboard?
4. What happens if a request returns a 401 or 403 status code?
5. Why is there an `eslint-disable-next-line` comment in the `useEffect`?
6. What is the purpose of the `loading` state in the Dashboard?
7. How would you implement auto-refresh of dashboard data?
8. What is the purpose of the empty dependency array in `useEffect`?

### 4.3 State Management
1. How many pieces of state are managed in the Dashboard component?
2. What is the purpose of each state variable?
3. How is the `newPost` state structured?
4. What is the initial state of `newPost`?

### 4.4 Charts & Visualization
1. What charting library is used, and what are its dependencies?
2. What Chart.js components need to be registered before use?
3. What types of charts are displayed on the dashboard?
4. How is data transformed for the Bar chart?
5. How is data transformed for the Line chart?
6. How is data transformed for the Pie chart?
7. What is the purpose of the `tension` property in the Line chart?
8. What colors are used for the chart datasets?
9. How would you make the charts responsive?
10. What is `toLocaleString()` used for in the summary cards?

### 4.5 Post Management
1. How does a user add a new post?
2. What fields are required when adding a new post?
3. What platforms are supported for new posts?
4. What happens after a post is successfully added?
5. How does a user delete a post?
6. What confirmation mechanism is used before deleting a post?
7. What happens after a post is successfully deleted?
8. How would you implement post editing functionality?

### 4.6 Leaderboard
1. How is the leaderboard data displayed?
2. What emoji indicators are used for top ranks?
3. What columns are shown in the leaderboard table?

### 4.7 Summary Cards
1. What information is displayed in the summary cards?
2. How many summary cards are there?
3. What CSS classes are used for the card colors?
4. How is the `Number` constructor used in the summary cards?

### 4.8 Top Post Banner
1. What information is displayed in the top post banner?
2. Under what condition is the top post banner displayed?

---

## 5. CSS & Styling (Login.css & Dashboard.css)

### 5.1 Login.css
1. What CSS technique is used for the login page background?
2. What is the purpose of `box-sizing: border-box`?
3. How is the login card centered on the page?
4. What CSS properties create the tab button toggle effect?
5. How are input focus states styled?
6. What happens when the submit button is disabled?
7. How would you make the login page responsive?

### 5.2 Dashboard.css
1. What CSS layout technique is used for the summary cards?
2. How is the navbar styled?
3. What CSS feature creates the gradient backgrounds on the cards?
4. How is the charts grid laid out?
5. What is the purpose of the `.chart-box.full-width` class?
6. How are tables styled in the dashboard?
7. What CSS technique is used for the platform badges?
8. How is responsive design handled in the dashboard?
9. What breakpoint is used for mobile responsiveness?
10. How does the layout change on mobile devices?
11. What CSS properties are used for the delete button hover effect?
12. How is the top-post-banner styled?

---

## 6. State Management & Hooks

1. What React hooks are used in the frontend application?
2. What is the purpose of `useState` in the Login component?
3. What is the purpose of `useNavigate`?
4. What is the purpose of `useEffect` in the Dashboard component?
5. Why is `useEffect` dependency array empty in the Dashboard?
6. How would you implement `useReducer` for the Dashboard state?
7. What is the purpose of `useCallback` and when would you use it here?
8. What is the purpose of `useMemo` and when would you use it here?
9. How would you implement a custom hook for API calls?
10. How would you implement a custom hook for form handling?

---

## 7. API Integration & Axios

1. What HTTP client library is used?
2. What is the base API URL?
3. How are authenticated requests made?
4. What is the format of the Authorization header?
5. How are POST requests structured for adding a new post?
6. How are DELETE requests structured for removing a post?
7. How would you implement request interceptors?
8. How would you implement response interceptors?
9. What is the purpose of the `catch` blocks in API calls?
10. How would you implement API request retry logic?
11. What CORS considerations might apply to this application?
12. How would you handle offline scenarios?

---

## 8. Error Handling & Security

1. How are API errors displayed to the user?
2. What happens when a 401/403 error occurs?
3. How is the user redirected on authentication failure?
4. What security risks exist with the current authentication approach?
5. How would you implement XSS protection?
6. How would you implement CSRF protection?
7. What is the purpose of `window.confirm` in the delete handler?
8. How would you implement input sanitization?
9. What happens if the API is unreachable?
10. How would you implement a global error boundary?

---

## 9. Performance & Best Practices

1. How can the Dashboard component's rendering be optimized?
2. What is the purpose of `React.memo` and when would you use it?
3. How would you implement code splitting for the routes?
4. What is the purpose of `lazy loading` in React?
5. How would you optimize the chart re-renders?
6. What is the purpose of `key` props in list rendering?
7. Are there any missing `key` props in the current code?
8. How would you implement infinite scrolling for the posts table?
9. How would you optimize the `fetchAllData` function?
10. What is the purpose of `Promise.all` vs sequential awaits?
11. How would you add a loading skeleton instead of the text loader?
12. What image optimization strategies would you apply?

---

## 10. Testing & Deployment

1. What testing libraries are available in the project?
2. How would you write a unit test for the `PrivateRoute` component?
3. How would you write a test for the Login form submission?
4. How would you mock the API calls in tests?
5. How would you test the Dashboard charts?
6. What is the purpose of `react-scripts` in the build process?
7. What files are generated by `npm run build`?
8. How would you configure environment variables for different deployments?
9. What is the purpose of the `.gitignore` file in the frontend?
10. How would you set up CI/CD for this frontend application?

---

## 11. Bonus / Advanced Questions

1. How would you migrate this application to TypeScript?
2. How would you implement state management with Redux or Zustand?
3. How would you add dark mode support?
4. How would you implement real-time updates using WebSockets?
5. How would you add internationalization (i18n) support?
6. How would you implement server-side rendering (SSR)?
7. How would you migrate from `localStorage` to secure HTTP-only cookies?
8. How would you implement a progressive web app (PWA)?
9. How would you add drag-and-drop functionality for posts?
10. How would you implement data export (CSV/PDF) functionality?
11. How would you add user profile management?
12. How would you implement social login (Google, GitHub)?
13. How would you add pagination to the posts table?
14. How would you implement search and filtering for posts?
15. How would you add data caching with React Query or SWR?

---

*Generated for the Social Media Analytics Dashboard Frontend*

