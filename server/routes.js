import express from 'express';
import cors from 'cors'
import control from './control.js'
import session from "express-session";
import connect_pg from 'connect-pg-simple'
import pg from 'pg';

import multer from 'multer';


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })


const app = express();

const port = 3000;

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

  
  console.log("hekki")
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})