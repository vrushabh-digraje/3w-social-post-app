# MERN Stack Deployment Guide (3W Social Post Application)

This guide provides step-by-step instructions to deploy your Full-Stack Mini Social Post application to production.

---

## 🛠️ Step 1: Deploy Database (MongoDB Atlas)

To deploy your database to the cloud, use the free tier of **MongoDB Atlas**:

1. **Sign Up / Log In**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. **Create a Free Cluster**: 
   * Click **Create a Database**.
   * Choose the **M0 (Free)** tier.
   * Select your preferred cloud provider (AWS/Google Cloud) and region (closest to you), then click **Create**.
3. **Set Up Security & Credentials**:
   * **Database User**: Choose a Username and Password (remember these; you will need them for your connection string).
   * **Network Access**: Add an IP address rule. For a public server (like Render), whitelist access from anywhere by adding **`0.0.0.0/0`** (Allow access from anywhere).
4. **Get Connection String**:
   * Go to your cluster dashboard and click **Connect**.
   * Choose **Drivers** (Node.js).
   * Copy the connection string. It will look like this:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   * Replace `<username>` and `<password>` with the credentials you created in step 3. Rename the database in the URL path by appending `/3w-social` before the `?` query parameters.

---

## ☁️ Step 2: Deploy Backend API (Render)

We will deploy the Node.js/Express server to **Render** (free tier):

1. **Sign Up / Log In**: Go to [Render](https://render.com/) and sign in using your GitHub account.
2. **Create Web Service**:
   * Click **New +** and select **Web Service**.
   * Select your GitHub repository (`vrushabh-digraje/3w-social-post-app`).
3. **Configure Project Settings**:
   * **Name**: `3w-social-api` (or any preferred name)
   * **Root Directory**: `backend` (⚠️ **Very Important**: Make sure to set this so Render knows where the backend code resides)
   * **Language**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node src/server.js`
4. **Add Environment Variables**:
   * Click **Advanced** and add the following keys under **Environment Variables**:
     * `MONGO_URI` = `YOUR_MONGODB_ATLAS_CONNECTION_STRING` (copied in Step 1)
     * `JWT_SECRET` = `a_long_random_secure_string_here`
     * `NODE_ENV` = `production`
5. **Deploy**: Click **Create Web Service** at the bottom. Render will compile your server and give you a live URL, e.g., `https://3w-social-api.onrender.com`.

---

## 🚀 Step 3: Deploy Frontend Client (Vercel)

We will deploy the React SPA (Vite-based) to **Vercel** (free tier):

1. **Sign Up / Log In**: Go to [Vercel](https://vercel.com/) and sign in using your GitHub account.
2. **Import Project**:
   * Click **Add New** and select **Project**.
   * Select your GitHub repository (`vrushabh-digraje/3w-social-post-app`) and click **Import**.
3. **Configure Project Settings**:
   * **Framework Preset**: Select **Vite** (Vercel should auto-detect this).
   * **Root Directory**: Click edit and select **`frontend`** (⚠️ **Very Important**: Make sure to select the `frontend` folder).
   * Keep default Build and Output Settings.
4. **Add Environment Variables**:
   * Under **Environment Variables**, add:
     * `VITE_API_URL` = `https://your-backend-api-name.onrender.com/api` (The live URL of your Render backend API from Step 2, ending in `/api`).
5. **Deploy**: Click **Deploy**. Vercel will build your React code and give you a live production URL (e.g., `https://3w-social-post-app.vercel.app`).

---

## 📤 Submission Requirements
Once the deployment succeeds, copy your live URLs and submit them to the company:
* **GitHub Repository URL**: `https://github.com/vrushabh-digraje/3w-social-post-app`
* **Live Deployed Frontend URL**: Your Vercel link.
