import express from "express";
import mongoose from "mongoose";   
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
import cloudinary from "cloudinary";
import userRoutes from './routes/userRoute.js'

const app = express();
app.use(bodyParser.json());
// app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({
    origin: 'http://localhost:5173', // Adjust this based on your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

mongoose
    .connect(MONGOURL)
    .then(() => { 
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        })
    })
    .catch((error) => console.log(error));

app.use('/api', route);
app.use('/api/users', userRoutes);
