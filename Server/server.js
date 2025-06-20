import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbconnect } from "./DBConnection.js";
import ImageModel from './models.js';
import path from 'path';

dotenv.config();
const app = express();
// ✅ Set up CORS at the very top (before all routes and middleware)
app.use(cors({
  origin: 'http://localhost:3000', // OR use process.env.CLIENT_URL
  methods: ['GET', 'POST'],
  credentials: false
}));


dbconnect();



// Required to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serving static files (safe after CORS)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + '/public')));

// app.use((req, res, next) => {
//   console.log("here")
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

// Test route
app.get('/', (req, res) => {
  res.send("alive");
});



// API endpoints
app.get('/images', async (req, res) => {
  console.log('here')
  const search = req.query.search || "";
  try {
    console.log(search)
    // if(!!search){
    //   const images = await ImageModel.find({
    //     imageText: { $regex: search, $options: "i" }
    //   }).sort({ _id: -1 });
    // } else {
      const images = await ImageModel.find({}).sort({ _id: -1 });
    // }
 
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
    res.status(500).json({ msg: err });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is Up: PORT ${port}`);
});
