import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb'}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, "public/assets");
    },
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('/auth/register',upload.single("picture"),register);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users",userRoutes);

/* MONGOOSE SETUP */
const port = process.env.PORT || 6000;

process.env.MONGO_URL !== undefined ? mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => console.log(`you are listening on ${port}`))
}).catch(e => console.log(e)) : console.log("wrong setup");

mongoose.set('strictQuery', true);