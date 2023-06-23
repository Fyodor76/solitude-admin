import express from 'express'
import bodyParser from "body-parser";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv"
import mongoose from "mongoose";
import { fileURLToPath} from "url";
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import postRouter from './routes/posts.js'
import {posts, users} from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express();
const port = process.env.PORT || 5000

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin'}))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage })


/* ROUTES WITH FILES */


/* ROUTES WITH FILES */

app.use("/auth", upload.single('picture'), authRouter)
app.use("/users", usersRouter)
app.use("/posts", upload.single('picture'), postRouter)

const start = async () => {
    try {
        mongoose.connect(process.env.BD_URL)
            .then(() => console.log('db is ok'))
            .catch((err) => console.log('DB error', err))
        app.listen(port, () => console.log(`server started on ${port}`))

        await Post.insertMany(posts)
    } catch (e) {
        console.log(e)
    }
}

start()