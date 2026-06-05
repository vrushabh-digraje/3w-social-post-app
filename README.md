# 3W Mini Social Post Application

A high-fidelity, responsive, and visually stunning Full-Stack Social Feed Application built for the **3W Full Stack Internship Assignment**. 

Users can register, log in, create text and/or image posts, and interact with other users' posts via likes and comments in a public community feed. The user interface features a premium modern glassmorphic look styled with **Material-UI (MUI)** and **Vanilla CSS** (strictly avoiding TailwindCSS).

---

## 🚀 Key Features

1. **Secure User Authentication**: Complete signup and login flow with password hashing (bcrypt) and protected route guards (JWT tokens).
2. **Interactive Community Feed**: A central public feed aggregating posts from all users.
3. **Flexible Post Creation**: Users can create posts containing text-only, image-only, or both text and image.
4. **Smart Image Compression**: Client-side Canvas-based resizing and compression to store high-quality image previews as Base64 strings. This avoids the need for external cloud storage credentials (like AWS S3) while maintaining fast database operations and satisfying MongoDB document limits.
5. **Real-time Interaction Feedback (Optimistic UI)**: Liking or commenting on a post updates the frontend state instantly for a fluid, lag-free user experience, while API synchronization occurs in the background.
6. **Detailed Interaction Lists**: Users can see the list of usernames of everyone who liked a post directly via interactive tooltips.
7. **Cursor Pagination & Load More**: Optimized data fetching to load posts efficiently page by page.
8. **Strict Collection Constraint**: Built utilizing exactly **two MongoDB collections** (`users` and `posts`) to maintain query efficiency and clean schema designs.

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite, Single Page Application)
* **Backend**: Node.js + Express.js API
* **Database**: MongoDB (Mongoose ORM)
* **Styling**: Material-UI (MUI v6) + Custom Vanilla CSS Variables
* **API Client**: Axios

---

## 📁 Project Folder Structure

```
3W/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers (auth, posts)
│   │   ├── middleware/       # JWT Auth protectors
│   │   ├── models/           # Mongoose schemas (User, Post)
│   │   ├── routes/           # API routes (auth, posts)
│   │   └── server.js         # Express app entry point
│   ├── .env                  # Environment configurations
│   └── package.json
│
├── frontend/                 # Vite + React Client SPA
│   ├── src/
│   │   ├── assets/           # Static icons and logos
│   │   ├── components/       # Reusable components (Navbar, PostCard, CreatePostModal)
│   │   ├── context/          # Global Auth state context
│   │   ├── pages/            # Core views (Login, Register, Feed)
│   │   ├── App.jsx           # Routing & guards definition
│   │   ├── index.css         # Styling system & animations
│   │   └── main.jsx          # React mounting & Theme injections
│   ├── vite.config.js
│   └── package.json
│
└── README.md                 # Project Documentation
```

---

## 📦 Database Schemas (Exactly 2 Collections)

### 1. User Schema (`users` collection)
Stores essential credentials for authentication.
* `username` (String, unique, required)
* `email` (String, unique, required)
* `password` (String, hashed using bcrypt, required)
* `createdAt` (Date)

### 2. Post Schema (`posts` collection)
Maintains post details and embeds liked-by list and comment objects to avoid extra query joins.
* `user` (Mongoose ObjectId, ref: `User`)
* `username` (String, cached for fast rendering)
* `text` (String, optional)
* `image` (String, Base64 compressed, optional)
* `likes` (Array of Strings storing usernames who liked the post)
* `comments` (Array of Subdocuments containing `username`, `text`, `createdAt`)
* `createdAt` (Date)

---

## 🔌 API Endpoints Documentation

### Authentication Routes
* `POST /api/auth/register` - Register a new account.
  * Request Body: `{ "username": "...", "email": "...", "password": "..." }`
  * Response: `{ "_id": "...", "username": "...", "email": "...", "token": "JWT_TOKEN" }`
* `POST /api/auth/login` - Authenticate credentials.
  * Request Body: `{ "email": "...", "password": "..." }`
  * Response: `{ "_id": "...", "username": "...", "email": "...", "token": "JWT_TOKEN" }`
* `GET /api/auth/me` - Get logged-in user profile (Requires header: `Authorization: Bearer <token>`).

### Post & Interaction Routes
* `GET /api/posts?page=1&limit=8` - Get paginated feed posts.
  * Response: `{ "posts": [...], "page": 1, "pages": 5, "hasMore": true, "total": 40 }`
* `POST /api/posts` - Create a new post (Requires Auth).
  * Request Body: `{ "text": "optional text", "image": "optional base64 data url" }`
* `PUT /api/posts/:id/like` - Toggle like/unlike status (Requires Auth).
  * Response: Returns the updated post object with toggled likes array.
* `POST /api/posts/:id/comment` - Add a comment to a post (Requires Auth).
  * Request Body: `{ "text": "comment content" }`
  * Response: Returns the updated post object containing the new comment.

---

## ⚙️ How to Setup and Run Locally

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas URI.

### Step 1: Run the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder (a template is pre-created) and configure:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/3w-social
   JWT_SECRET=supersecretjwtkeyfor3wsocialapp123!
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### Step 2: Run the Frontend Client
1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## ☁️ Deployment Guidelines

To deploy the application to live web hosts:

### 1. Database (MongoDB Atlas)
* Create a free cluster on MongoDB Atlas.
* Whitelist all IP addresses (`0.0.0.0/0`) in network access.
* Copy the connection string and replace the `MONGO_URI` variable in the backend's environment settings.

### 2. Backend Server (Render)
* Sign up on Render and create a new **Web Service**.
* Connect your GitHub repository and set the Root Directory as `backend`.
* Select Environment as `Node`.
* Add Environment Variables:
  * `MONGO_URI` (Your Atlas URI)
  * `JWT_SECRET` (A strong random string)
  * `PORT` (Usually pre-set or 10000)

### 3. Frontend Client (Vercel or Netlify)
* Create a new project on Vercel or Netlify.
* Link your GitHub repository and set the Root Directory to `frontend`.
* Add an Environment Variable:
  * `VITE_API_URL` (Set this to your live Render API URL, e.g. `https://your-app-api.onrender.com/api`)
* Trigger deployment.
