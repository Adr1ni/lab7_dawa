const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path'); 

mongoose.connect('mongodb://root:123456@localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'views', 'uploads')));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'views')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'views', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const Artist = mongoose.model('Artist', {
  serie: String,
  artist: String,
  year: Number,
  imageUrl: String,
});

app.get('/ingresar', (req, res) => {
  res.render('admin');
});

app.post('/ingresar', upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
  const { title, artist, year } = req.body;
  const imageUrl = req.files['image'][0].filename;

  const artistEntity = new Artist({ title, artist, year, imageUrl });

  artistEntity.save()
    .then(() => {
      res.redirect('/listar');
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/listar', (req, res) => {
  Artist.find({})
    .then(artist => {
      res.render('music', { artist });
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});
