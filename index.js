const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './assets');
    console.log('saved');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post('/importUser', upload.single('file'), async (req, res) => {
  try {
    res.send({ status: 200, message: 'success' });
  } catch (err) {
    res.send({ message: 'got error' });
  }
});

app.get('/', (req, res) => {
  res.send(`hello admin`);
});

app.listen(2000, () => {
  console.log('Server Started');
});