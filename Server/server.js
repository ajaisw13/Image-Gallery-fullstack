import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { dbconnect } from "./DBConnection.js";
import ImageModel from './models.js';
import path from 'path';

dotenv.config();
const app = express();

// Firebase Admin — verifies ID tokens issued by Firebase Auth
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin) || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false
}));

dbconnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + '/public')));

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

app.get('/', (req, res) => {
  res.send("OK");
});

app.get('/images', authenticate, async (req, res) => {
  const search = req.query.search || "";
  try {
    const query = search
      ? { userId: req.uid, imageText: { $regex: search, $options: "i" } }
      : { userId: req.uid };
    const images = await ImageModel.find(query).sort({ _id: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.post('/', authenticate, async (req, res) => {
  try {
    const { imageText, imageUrl } = req.body;
    const image = await ImageModel.create({ userId: req.uid, imageText, imageUrl });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.delete('/images/:id', authenticate, async (req, res) => {
  try {
    const image = await ImageModel.findOneAndDelete({ _id: req.params.id, userId: req.uid });
    if (!image) return res.status(404).json({ msg: 'Image not found' });
    res.status(200).json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
