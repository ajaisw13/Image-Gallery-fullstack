import express from "express";
import cors from "cors"
import { dbconnect } from "./DBConnection.js";
import dotenv from "dotenv";
import ImageModel from './models.js';
import path from 'path'

dotenv.config()

let app = express();
dbconnect()
app.use(express.json());
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + '/public')))
// right now used in development purpose only as we are utilizing public folder to serve html, JS files
app.use(cors({
  origin: `${process.env.CLIENT_URL}`
}))

app.use(express.urlencoded({ extended: false }));

app.get('/', async(_, res) => {
  res.send("alive")
});
const port = process.env.PORT||5000

app.get('/images', async(_, res) => {
  try {
    const image = await ImageModel.find({}).sort({_id:-1})
    res.status(200).json(image)
  } catch (err) {
    res.status(404).json({msg: err})
    console.error("Unable to retrive images from DB")
  }
});

app.post('/', async (req, res) => {
  try {
    const {imageText, imageUrl } = req.body
    const image = await ImageModel.create({
      imageText: imageText,
      imageUrl: imageUrl
    })
    res.status(201).json(image)
  } catch (err) {
    res.status(404).json({msg: err})
    console.error("Unable to post image")
  }
})

app.listen(port, () => {
    console.log(`Server is Up: PORT ${port}`)
})

export default app;
