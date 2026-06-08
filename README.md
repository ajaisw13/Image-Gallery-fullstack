# Image Gallery

A full-stack photo gallery web app — sign in, upload, search, browse, and delete your own photos with a clean, responsive UI.

**Live Demo:** https://image-gallery-client-alpha.vercel.app

![Screenshot](Client/public/Screenshot.png)

Built with **React 18**, **Node.js/Express**, **MongoDB**, and **Firebase Authentication**.

---

## Features

- **Google & Email Sign-in** — Authenticate with Google OAuth or email/password via Firebase Auth
- **Email Verification** — New email/password accounts require email verification before accessing the gallery
- **Per-account Gallery** — Each user sees only their own images; uploads and deletes are scoped to the signed-in account
- **Upload Photos** — Direct browser-to-cloud upload via Cloudinary (no backend round-trip)
- **Instant Preview** — Preview image before saving to keep your gallery clean
- **Real-time Search** — Debounced search across image titles with MongoDB regex matching
- **Delete Photos** — Hover any photo to reveal a delete button
- **Responsive Grid** — Adapts from 2 columns on mobile to 6 on large displays
- **Lazy Loading** — Images load on demand for a fast initial page load

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Material UI v5, Vite |
| Authentication | Firebase Auth (Google OAuth + email/password) |
| File Upload | Cloudinary (unsigned upload) |
| Backend | Node.js, Express 5 |
| Token Verification | Firebase Admin SDK |
| Database | MongoDB, Mongoose |
| Deployment | Vercel (client + server) |

---

## Authentication Flow

```
Sign up (email)          Sign in (Google)
     │                         │
     ▼                         ▼
Verification email       Instant access
sent automatically
     │
     ▼
Click link in email
     │
     ▼
        Gallery (scoped to your account)
```

Every API request carries a short-lived Firebase ID token in the `Authorization` header. The server verifies it with the Firebase Admin SDK before processing any query — no token, no access.

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- A free [Cloudinary](https://cloudinary.com) account with an **unsigned upload preset**
- A [Firebase](https://console.firebase.google.com) project with **Email/Password** and **Google** sign-in methods enabled

### Installation

```bash
git clone https://github.com/<your-username>/Image-Gallery-fullstack.git
cd Image-Gallery-fullstack

# Install server dependencies
cd Server && npm install

# Install client dependencies
cd ../Client && npm install
```

### Environment Variables

**`Server/.env`**
```
MONGODB_URL=mongodb://localhost:27017/imageGallery
CLIENT_URL=http://localhost:3000,http://localhost:5173
PORT=5001

# Firebase Admin SDK
# Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**`Client/.env`**
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
VITE_GET_IMAGES=http://localhost:5001/images
VITE_POST_IMAGE_URL=http://localhost:5001

# Firebase — get these from Firebase Console → Project Settings → Your apps → Web app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add a **Web app** to the project
3. Go to **Authentication → Sign-in method** and enable:
   - **Email/Password**
   - **Google**
4. Go to **Authentication → Settings → Authorized domains** and add your Vercel deployment URL
5. Go to **Project Settings → Service accounts → Generate new private key** and copy the 3 values into `Server/.env`

### Run Locally

```bash
# Terminal 1 — API server
cd Server && npm start

# Terminal 2 — React dev server
cd Client && npm start
```

App: `http://localhost:5173`  
API: `http://localhost:5001`

---

## API Reference

All endpoints require a valid Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/images` | Fetch images for the authenticated user. Supports `?search=query` |
| `POST` | `/` | Save image `{ imageText, imageUrl }` under the authenticated user |
| `DELETE` | `/images/:id` | Delete image by ID (only if owned by the authenticated user) |

---

## Project Structure

```
Image-Gallery-fullstack/
├── Client/                           # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── ImageGallery.jsx      # Upload form + search toolbar
│       │   ├── Images.jsx            # Responsive photo grid
│       │   ├── Login.jsx             # Sign-in / sign-up / forgot password
│       │   └── VerifyEmail.jsx       # Email verification gate
│       ├── contexts/
│       │   └── AuthContext.jsx       # Firebase auth state + helper functions
│       ├── api.js                    # Axios instance with auto token injection
│       ├── firebase.js               # Firebase app initialisation
│       ├── theme.js                  # MUI custom theme
│       └── styles.js                 # Shared component styles
└── Server/                           # Express REST API
    ├── server.js                     # Routes, CORS, auth middleware
    ├── models.js                     # Mongoose Image schema (includes userId)
    └── DBConnection.js               # MongoDB connection
```

---

## Storage Note

Image files are stored on **Cloudinary** and are publicly accessible via their URLs. The per-account scoping enforced by this app controls what appears in each user's gallery, but does not restrict direct URL access. For fully private image storage, consider switching to Firebase Storage with security rules or Cloudinary authenticated delivery.

---

## License

MIT
