import express from 'express';
import 'dotenv/config';

import generateRouter from './routes/generate.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express with pnpm!');
});

app.use('/generate', generateRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
