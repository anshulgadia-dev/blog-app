import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded, json, text } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import passport from './config/passport.js';
import authRouter from './routes/auth.route.js';
import blogRouter from './routes/blog.route.js';

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);
app.use(json());
app.use(text());
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => {
  res.send('Server is Up and running');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blog', blogRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
