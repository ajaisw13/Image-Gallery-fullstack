import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

await mongoose.connect(process.env.MONGODB_URL);

const Image = mongoose.model('Image', new mongoose.Schema({
  imageText: String,
  imageUrl: String,
}));

const images = await Image.find({}).sort({ _id: 1 });
const seen = new Map();
const toDelete = [];

for (const img of images) {
  if (seen.has(img.imageText)) {
    toDelete.push(img._id);
  } else {
    seen.set(img.imageText, img._id);
  }
}

if (toDelete.length === 0) {
  console.log('No duplicates found.');
} else {
  await Image.deleteMany({ _id: { $in: toDelete } });
  console.log(`Removed ${toDelete.length} duplicate(s).`);
}

const remaining = await Image.countDocuments();
console.log(`Images remaining: ${remaining}`);
await mongoose.disconnect();
