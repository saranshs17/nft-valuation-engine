import express from 'express';
import cors from 'cors';
import { router } from './api/routes';
import 'dotenv/config';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`✅ Backend server listening at http://localhost:${port}`);
});