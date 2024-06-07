import path from 'path';
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
import productRoutes from "./routes/productRoutes.js";
import userRoutes from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/orderRoutes.js'
import uploadRoute from './routes/UploadRoute.js';

connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookie-parser middleware
app.use(cookieParser());


app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload',uploadRoute);

app.get('/api/config/paypal', (req,res) => 
    res.send({clientId: process.env.PAYPAL_CLIENT_ID})
)

const __dirname = path.resolve();
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

if(process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, '/client/build')));

    //not valid route
    app.get('*', (req,res) => 
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    )
} else {
    app.get("/",(req,res) => {
    res.send("API is running...");
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT,() => 
    console.log(`server is listening on port ${PORT}`)
)
