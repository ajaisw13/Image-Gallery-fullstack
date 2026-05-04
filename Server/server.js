import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbconnect } from "./DBConnection.js";
import ImageModel from './models.js';
import path from 'path';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false
}));

dbconnect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
  res.send("OK");
});

app.get('/images', async (req, res) => {
  const search = req.query.search || "";
  try {
    const query = search
      ? { imageText: { $regex: search, $options: "i" } }
      : {};
    const images = await ImageModel.find(query).sort({ _id: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const { imageText, imageUrl } = req.body;
    const image = await ImageModel.create({ imageText, imageUrl });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

app.delete('/images/:id', async (req, res) => {
  try {
    const image = await ImageModel.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ msg: 'Image not found' });
    res.status(200).json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Only bind to a port when running locally — Vercel uses the default export
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
