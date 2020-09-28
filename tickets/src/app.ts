import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@eltickets/common';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed:false,
        //Disable secure when running tests
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };