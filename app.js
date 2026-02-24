import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config();
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.route.js';
import blogRouter from './routes/blog.route.js';
import passport from './config/passport.js'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();
app.use(helmet());
app.use(cors({
    origin : "*",
    credentials : true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(morgan('dev'))


app.get('/' , (req,res)=>{
    res.send('Server is Up and running')
})

app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/blog' , blogRouter);


const PORT = process.env.PORT || 3001
app.listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDB();
})
