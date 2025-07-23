import express from 'express';
import cors from 'cors'
import control from './control.js'
import session from "express-session";
import connect_pg from 'connect-pg-simple'
import pg from 'pg';
import fs from 'fs'
import multer from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base_path = path.join(__dirname, 'uploads');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const user_id = req.session.user_id;

      const user_path = path.join(base_path, String(user_id))

      console.log(user_path)

      fs.mkdir(user_path, { recursive: true }, (err) => {
      cb(err, user_path);
    });
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

const app = express();

const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json())

app.use(express.urlencoded({extended: true}))

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "tickets",
    password: "123456",
    port: 5432,
});
db.connect();

const pgSession = connect_pg(session);

app.use(session({
  store: new pgSession({
    pool: db,
    tableName: 'session',
    createTableIfMissing: "true"
  }),
  secret: "hello there",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  }
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.post('/login', control.login)

app.get('/test', ()=>{
  console.log("test")
})

app.post('/upload', upload.single('file'), (req, res) => {
  const user_id = req.session.user_id;
  const folder = req.body.folder;

  const user_path = path.join(base_path, String(user_id), folder);

  const original_name = req.file.originalname;
  const temp_path = req.file.path;

  const targer_path = path.join(user_path, original_name);

  fs.rename(temp_path, targer_path, (err) => {
    if (err) {
      console.log(err);
    }
  });
})

app.post('/add-folder', (req, res) => {

  console.log("here")

  const foldername = req.body.foldername;

  const folder = req.body.folder

  console.log(foldername)

  const userDir = path.join(__dirname, 'uploads', String(req.session.user_id), folder, foldername);


  fs.mkdir(userDir, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  })

})

app.post('/get-stuff', (req, res) => {

  const folder = req.body.folder;

  const dir = path.join(__dirname, 'uploads', String(req.session.user_id), folder);

  fs.readdir(dir, 
    { withFileTypes: true },
    (err, entries) => {
    if (err)
      console.log(err);
    else {
      const files = entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'folder' : 'file'
      }));
      console.log(files)
      res.json({files: files})
    }
  })

})

app.get('/view', (req, res) => {
  const user_id = req.session.user_id;
  const { folder = '', filename } = req.query;

  const file_path = path.join(base_path, String(user_id), folder, filename);

  res.sendFile(file_path, (err) =>{
    console.log(err);
  });
});

app.get('/download', (req, res) => {
  const user_id = req.session.user_id;
  const { folder = '', filename } = req.query;

  const file_path = path.join(base_path, String(user_id), folder, filename);

  res.download(file_path);
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})