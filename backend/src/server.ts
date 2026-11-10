import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/connection';
import { ticketRoutes } from './routes/ticketRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/tickets', ticketRoutes);

app.listen(PORT, () => {
  console.log(`🚀 TechDesk QA Backend rodando em http://localhost:${PORT}`);
});
