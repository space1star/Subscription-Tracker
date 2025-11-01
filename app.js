import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.route.js';

import connectToDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();


//built-in middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

//ROUTERS
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

//MIDDLEWARE
app.use(errorMiddleware);

      //path, handler(callback fun)
app.get('/',(req, res) => {
    //When someone visits http://localhost:3000/, the server responds with "Hello from home page!"
    //res.send('Hello from home page!');
    res.send('Welcome to the Subscription Tracker API!');
});

         //port, callback fun
app.listen(PORT, async() => {
    //console.log('Server is running on port 3000');
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

    await connectToDB();
});

export default app;