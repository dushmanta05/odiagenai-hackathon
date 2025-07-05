import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import generateRouter from './routes/generate.js';

const app = express();
const port = process.env.PORT;
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];
app.get('/', (_, res) => {
  res.send('Hello from Express with pnpm!');
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use('/generate', generateRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
