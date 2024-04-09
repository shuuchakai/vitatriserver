import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

import userRoutes from './routes/user.router.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

app.use(cors(
    {
        origin: '*',
        optionsSuccessStatus: 200
    }
));
app.use(morgan('dev'));
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.send("Ruta principal de la API");
});

app.use('/api/users', userRoutes);

app.use(errorHandler);

app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found" });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});