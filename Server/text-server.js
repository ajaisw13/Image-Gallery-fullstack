import express from 'express';
import cors from 'cors';

const app = express();

// ✅ CORS MIDDLEWARE — this must come before any route
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: false
}));

app.use(express.json());

app.get('/images', (req, res) => {
  res.json([{ id: 1, url: 'http://fake.img', title: 'Test Image' }]);
});

app.listen(5000, () => {
  console.log('✅ Test Server running on http://localhost:5000');
});